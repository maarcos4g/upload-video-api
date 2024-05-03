import { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { Unauthorized } from '@/http/routes/_errors/unauthorized'
import { userPayload } from '@/utils/auth'
import { BadRequest } from '../routes/_errors/bad-request'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    request.getCurrentUser = async () => {
      try {
        if (request.cookies.auth) {
          const payload = app.jwt.verify(request.cookies.auth)

          if (!payload) {
            throw new Unauthorized('Your session has expired.')
          }

          const user = app.jwt.decode(request.cookies.auth) as userPayload
          return user
        }

        throw new Unauthorized('You not have a session in app.')
      } catch {
        throw new Unauthorized('Invalid token')
      }
    }

    request.signUser = async (payload: userPayload) => {
      try {
        const token = await reply.jwtSign(payload, {
          sign: {
            expiresIn: '30d'
          }
        })

        reply.cookie('auth', token, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: '/',
        })

      } catch (error) {
        throw new BadRequest('Error during save session.')
      }
    }

    request.signOut = async () => {
      try {
        reply.clearCookie('auth')
      } catch (error) {
        throw new BadRequest('Error during finishing session.')
      }
    }
  })
})