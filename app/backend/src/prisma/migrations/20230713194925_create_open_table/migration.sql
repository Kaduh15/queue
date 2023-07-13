-- CreateTable
CREATE TABLE "Open" (
    "id" SERIAL NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Open_pkey" PRIMARY KEY ("id")
);
