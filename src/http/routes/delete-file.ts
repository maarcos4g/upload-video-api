import { authentication } from "@/authentication";
import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import z from "zod";
import { BadRequest } from "./_errors/bad-request";

export async function deleteFileById(app: FastifyInstance) {
  app.delete('/file/:id', {
  }, async ({ params }, reply) => {
    const deletePostSchema = z.object({
      id: z.string().cuid()
    })

    const { id } = deletePostSchema.parse(params)

    const file = await db.file.findUnique({
      where: {
        id,
      }
    })

    if (!file) {
      throw new BadRequest('File not found.')
    }

    await db.file.delete({
      where: {
        id,
      }
    })
  })
}