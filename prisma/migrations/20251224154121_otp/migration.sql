-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "twoFactorBackupCodes" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- CreateTable
CREATE TABLE "public"."WebVitalsMetric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "page" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebVitalsMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebVitalsMetric_name_idx" ON "public"."WebVitalsMetric"("name");

-- CreateIndex
CREATE INDEX "WebVitalsMetric_createdAt_idx" ON "public"."WebVitalsMetric"("createdAt");
