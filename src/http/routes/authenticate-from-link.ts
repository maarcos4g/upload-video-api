import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { userPayload } from "@/utils/auth";
import { BadRequest } from "./_errors/bad-request";

import { auth } from "../middlewares/auth";
import { Unauthorized } from "./_errors/unauthorized";

export async function authenticateFromLink(app: FastifyInstance) {
  app
  .register(auth)
  .get('/auth-links/authenticate', async ({ query, signUser }, reply) => {
    const authFromLinkSchema = z.object({
      code: z.string(),
      redirect: z.string().url()
    })

    const { code, redirect } = authFromLinkSchema.parse(query)

    const authLinkFromCode = await db.authLink.findFirst({
      where: {
        code
      }
    })

    if (!authLinkFromCode) {
      throw new BadRequest('Code not found')
    }

    // if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
    //   throw new BadRequest('The code was expired')
    // }

    const user = await db.user.findUnique({
      where: {
        id: authLinkFromCode.userId!,
      }
    })

    if (!user) {
      throw new Unauthorized()
    }

    const payload: userPayload = {
      name: user.name,
      avatar: user.avatarUrl ?? '',
      email: user.email,
      sub: user.id,
    }

    await signUser(payload)

    await db.authLink.delete({
      where: {
        code,
      }
    })

    reply.redirect(301, redirect)
  })
}