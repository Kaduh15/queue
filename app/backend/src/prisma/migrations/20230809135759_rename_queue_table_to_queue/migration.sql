/*
  Warnings:

  - You are about to drop the `queue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "queue";

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);
