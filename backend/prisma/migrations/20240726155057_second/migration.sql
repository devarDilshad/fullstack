-- CreateTable
CREATE TABLE "PictureUrl" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PictureUrl_pkey" PRIMARY KEY ("id")
);
