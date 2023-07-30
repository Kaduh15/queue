-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WAITING', 'ABSENT', 'DONE');

-- AlterTable
ALTER TABLE "queue" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'WAITING';
