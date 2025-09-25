-- AlterTable
ALTER TABLE "public"."BlogPost" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ALTER COLUMN "published" SET DEFAULT false;
