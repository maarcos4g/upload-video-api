import fastify, { FastifyReply, FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import cookie from "@fastify/cookie"

import { env } from "@/env"

import { errorHandler } from "@/error-handler"
import { createUser } from "./routes/create-user"
import { createUploadURL } from "./routes/create-upload-url"
import { createDownloadURL } from "./routes/create-download-url"
import { updateFileStatus } from "./routes/update-file-status"
import { getAllFiles } from "./routes/get-all-files"
import { sendAuthenticationLink } from "./routes/send-authentication-link"
import { authenticateFromLink } from "./routes/authenticate-from-link"
import { deleteFileById } from "./routes/delete-file"
import { expiredFileAutomatically } from "./routes/expired-file-automatically"
import { signOut } from "./routes/sign-out"
import { getProfile } from "./routes/get-profile"
import { getFileDetails } from "./routes/get-file-details"
import { updateFile } from "./routes/update-file"

const app = fastify()

app.register(cors, {
  origin: [
    env.AUTH_REDIRECT_URL
  ],
  credentials: true,
  allowedHeaders: ['content-type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
})

app.register(jwt, {
  secret: env.JWT_SECRET,
})

app.register(cookie, {
  secret: env.JWT_SECRET,
  parseOptions: {}
})

//routes
app.register(createUser)
app.register(createUploadURL)
app.register(createDownloadURL)
app.register(updateFileStatus)
app.register(getAllFiles)
app.register(sendAuthenticationLink)
app.register(authenticateFromLink)
app.register(deleteFileById)
app.register(signOut)
app.register(getProfile)
app.register(getFileDetails)
app.register(updateFile)

app.setErrorHandler(errorHandler)

expiredFileAutomatically()
  .then()

app.listen({
  port: 3333,
  host: '0.0.0.0'
})
  .then(() => console.log('🔥 HTTP Server Running...'))
