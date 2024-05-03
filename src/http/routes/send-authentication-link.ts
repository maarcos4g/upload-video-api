import { db } from "@/db/connection";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";
import { customAlphabet, nanoid } from 'nanoid'
import { env } from "@/env";
import { resend } from "@/mail/client";
import { AuthenticationMagicLinkTemplate } from "@/mail/template/authentication-magic-link";

export async function sendAuthenticationLink(app: FastifyInstance) {
  app.post('/authenticate', async ({ body, protocol, hostname }) => {
    const sendAuthLinkSchema = z.object({
      email: z.string().email({ message: "Digite um e-mail válido" })
    })

    const { email } = sendAuthLinkSchema.parse(body)

    const userFromEmail = await db.user.findUnique({
      where: {
        email,
      }
    })

    if (!userFromEmail) {
      throw new BadRequest('The user not found')
    }

    const createId = customAlphabet('1234567890abcdef', 12)
    const authLinkCode = createId(12)

    await db.authLink.create({
      data: {
        code: authLinkCode,
        userId: userFromEmail.id
      }
    })

    const baseURL = `${protocol}://${hostname}`

    const authLink = new URL('/auth-links/authenticate', baseURL)
    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'marcospaullo552@gmail.com',
      subject: '[upload.video] Link para login',
      react: AuthenticationMagicLinkTemplate({
        userEmail: email,
        authLink: authLink.toString()
      })
    })
  })
}