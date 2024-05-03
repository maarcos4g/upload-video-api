-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('VALID', 'PROCESSING', 'EXPIRED');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'PROCESSING';
