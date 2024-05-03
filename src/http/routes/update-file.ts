import { FastifyInstance } from "fastify"

import { z } from "zod";

import { db } from "@/db/connection";
import { BadRequest } from "./_errors/bad-request";
import { auth } from "../middlewares/auth";

export async function updateFile(app: FastifyInstance) {
  app
    .register(auth)
    .put('/update/:id', async (request, reply) => {
      const { id } = z.object({
        id: z.string().cuid(),
      }).parse(request.params)

      const { name, slug } = z.object({
        name: z.string().min(3, { message: 'Digite pelo menos 3 caracteres.' }),
        slug: z.string().regex(/^[a-zA-Z0-9\s-]+$/, { message: "O slug deve conter apenas letras e hifens." }),
      }).parse(request.body)

      const { sub: userId } = await request.getCurrentUser()

      const file = await db.file.findUnique({
        where: {
          id,
        }
      })

      if (!file) {
        throw new BadRequest('The file not found.')
      }

      const updatedFile = await db.file.update({
        where: {
          id: file.id
        },
        data: {
          name,
          slug
        }
      })

      return reply.status(204).send({ file: updatedFile })
    })
}