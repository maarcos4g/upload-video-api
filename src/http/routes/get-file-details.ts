import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@/db/connection";
import { BadRequest } from "./_errors/bad-request";

export async function getFileDetails(app: FastifyInstance) {
  app
    .get('/file/:id', async (request, reply) => {
      const { id } = z.object({
        id: z.string().cuid()
      })
        .parse(request.params)

      const file = await db.file.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        }
      })

      if (!file) {
        throw new BadRequest('File not found')
      }

      return reply.status(200).send(file)
    })
}