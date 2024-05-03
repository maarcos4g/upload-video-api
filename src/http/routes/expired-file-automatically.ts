import { db } from "@/db/connection";
import dayjs from "dayjs";

export async function expiredFileAutomatically() {

  const fourteenDaysAgo = dayjs(new Date()).subtract(14, 'day').toDate();

  setTimeout(async () => {
    const [files] = await Promise.all([
      db.file.findMany({
        where: {
          createdAt: {
            lte: fourteenDaysAgo
          }
        },
      }),
  
      db.file.updateMany({
        where: {
          createdAt: {
            lte: fourteenDaysAgo
          }
        },
        data: {
          status: 'EXPIRED'
        }
      })
    ])

    console.log(`🔥 Found ${files.length} files created in 14 days ago.`)

    expiredFileAutomatically()
  }, 1000 * 60 * 60 * 12) // 12h
}