import { FastifyInstance } from "fastify"
import { BadRequest } from "./http/routes/_errors/bad-request"
import { ZodError } from "zod"
import { Unauthorized } from "./http/routes/_errors/unauthorized"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message })
  }

  if (error instanceof Unauthorized) {
    return reply.status(401).send({ message: 'Unauthorized', details: error.message })
  }

  return reply.status(500).send({ message: 'Internal Server Error!' })
}