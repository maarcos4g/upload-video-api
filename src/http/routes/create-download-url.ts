import { FastifyInstance } from "fastify"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { db } from "@/db/connection";
import { r2 } from "@/lib/cloudflare-r2";
import { env } from "@/env";
import { BadRequest } from "./_errors/bad-request";
import dayjs from "dayjs";

export async function createDownloadURL(app: FastifyInstance) {
  app.get('/uploads/:id', async ({ params }, reply) => {
    const getFileParamsSchema = z.object({
      id: z.string().cuid(),
    })

    const { id } = getFileParamsSchema.parse(params)

    const file = await db.file.findUnique({
      where: {
        id,
      }
    })

    if (!file) {
      throw new BadRequest('The file not found.')
    }

    if (file.status === 'EXPIRED' || file.status === 'PROCESSING') {
      throw new BadRequest('The file has expired.')
    }

    const signedUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: file.key,
      }),
      { expiresIn: 60 * 10 }
    )

    return reply.redirect(301, signedUrl)
  })
}