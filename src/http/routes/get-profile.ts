import { FastifyInstance } from "fastify";

import { auth } from "../middlewares/auth";
import { db } from "@/db/connection";

import { Unauthorized } from "./_errors/unauthorized";

export async function getProfile(app: FastifyInstance) {
  app
    .register(auth)
    .get('/profile', async (request, reply) => {
      const { sub: userId } = await request.getCurrentUser()

      const user = await db.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!user) {
        throw new Unauthorized('User not found.')
      }

      return reply.send({ user })
    })
}