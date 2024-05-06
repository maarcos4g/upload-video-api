import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import { db } from "@/db/connection";

export async function getUsage(app: FastifyInstance) {
  app
    .register(auth)
    .get('/usage', async (request, reply) => {
      const { sub: userId } = await request.getCurrentUser()

      const usage = await db.file.findMany({
        where: {
          userId,
        },
        select: {
          size: true,
        }
      })

      const totalBytes = usage.reduce((total, file) => total + Number(file.size), 0);

      const totalUsageInGB = totalBytes / (1024 * 1024 * 1024)

      const limitInGB = 10 // 10 GB

      const usagePercentage = (totalUsageInGB / limitInGB) * 100

      // let usageCount = (totalBytes / (1024 * 1024)).toFixed(2)

      return { 
        usage: {
          total: totalUsageInGB.toFixed(2),
          percentage: usagePercentage.toFixed(2),
        }
      }
    })
}