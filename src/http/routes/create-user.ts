import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";
import { userPayload } from "@/utils/auth";

export async function createUser(app: FastifyInstance) {
  app.post('/user', async ({ body }, reply) => {
    const createUserSchema = z.object({
      email: z.string().email({ message: "O e-mail precisa estar válido" }),
      name: z.string().min(4, { message: "O nome precisa ter no mínino 4 caracteres" })
    })

    const { email, name } = createUserSchema.parse(body)

    const userWithSameEmail = await db.user.findUnique({
      where: {
        email,
      }
    })

    if (userWithSameEmail !== null) {
      throw new BadRequest('Another user with the same email already exists.')
    }

    const user = await db.user.create({
      data: {
        email,
        name
      }
    })

    return reply.status(201)
  })
}