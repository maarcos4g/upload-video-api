import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { z } from "zod";
import { db } from "@/db/connection";
import { Unauthorized } from "./_errors/unauthorized";

export async function updateUserProfile(app: FastifyInstance) {
  app
    .register(auth)
    .put('/profile/update', async (request, reply) => {
      const { email, name } = z.object({
        email: z.string().email().optional(),
        name: z.string().min(4, { message: "O nome precisa ter no mínino 4 caracteres." }).optional()
      }).parse(request.body)

      const { sub: userId } = await request.getCurrentUser()

      const userById = await db.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!userById) {
        throw new Unauthorized()
      }

      await db.user.update({
        data: {
          name,
          email
        },
        where: {
          id: userId,
        }
      })

      return reply.status(204).send({ message: "success" })
    })
}