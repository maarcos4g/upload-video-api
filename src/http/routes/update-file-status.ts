import { FastifyInstance } from "fastify"

import { z } from "zod";

import { db } from "@/db/connection";
import { BadRequest } from "./_errors/bad-request";

export async function updateFileStatus(app: FastifyInstance) {
  app.put('/status/:id', async ({ params }) => {
    const updateFileParamsSchema = z.object({
      id: z.string().cuid(),
    })

    const { id } = updateFileParamsSchema.parse(params)

    const file = await db.file.findUnique({
      where: {
        id,
      }
    })

    if (!file) {
      throw new BadRequest('The file not found.')
    }

    await db.file.update({
      where: {
        id: file.id
      },
      data: {
        status: 'VALID'
      }
    })
  })
}