import 'fastify'

import { userPayload } from '@/utils/auth'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUser(): Promise<userPayload>
    signUser(payload: userPayload): Promise<void>
    signOut(): Promise<void>
  }
}