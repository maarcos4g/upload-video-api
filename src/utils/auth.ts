import { z } from "zod"

const userPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  name: z.string(),
})

export type userPayload = z.infer<typeof userPayloadSchema>