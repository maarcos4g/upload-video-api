import { FastifyRequest } from "fastify";

export async function authentication(request: FastifyRequest) {
  await request.jwtVerify()
}