import { randomUUID } from "node:crypto";

import { FastifyInstance } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { generateSlug } from "@/utils/generate-slug";
import { r2 } from "@/lib/cloudflare-r2";
import { env } from "@/env";
import { db } from "@/db/connection";
import { auth } from "../middlewares/auth";

export async function createUploadURL(app: FastifyInstance) {
  app
  .register(auth)
  .post('/uploads', {
  }, async (request, reply) => {

    const { sub: userId } = await request.getCurrentUser()

    const uploadBodySchema = z.object({
      name: z.string().min(1, { message: "Insira um nome válido para o arquivo." }),
      contentType: z.string().regex(/\w+\/[-+.\w]+/),
      size: z.number(),
    })

    const { name, contentType, size } = uploadBodySchema.parse(request.body)

    const fileKey = randomUUID()

    let cleanedName;
    let slug;

    if (name.includes('.mp4')) {
      cleanedName = name.replace(/\.mp4/, '')
    }

    slug = generateSlug(cleanedName ? cleanedName : name)

    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: fileKey,
        ContentType: contentType,
      }),
      { expiresIn: 60 * 20 } // 20 minutos
    )

    const expiresAt = dayjs(new Date()).add(14, 'days').toDate()

    const file = await db.file.create({
      data: {
        contentType,
        name,
        size: size.toString(),
        slug,
        key: fileKey,
        expiresAt,
        userId,
      }
    })

    return reply.status(201).send({ signedUrl, fileId: file.id })
  })
}