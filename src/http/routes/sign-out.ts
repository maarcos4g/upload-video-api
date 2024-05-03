import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";

export async function signOut(app: FastifyInstance) {
  app
    .register(auth)
    .post('/sign-out', async ({ signOut }, reply) => {
      try {
        await signOut()
        return reply.status(200)
      } catch (error) {
        console.log(error)
      }
    })
}