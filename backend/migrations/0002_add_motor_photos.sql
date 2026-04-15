-- Add photo fields to motors table for storing 4 different motor photos
ALTER TABLE "motors" ADD COLUMN "foto_depan" text;
ALTER TABLE "motors" ADD COLUMN "foto_belakang" text;
ALTER TABLE "motors" ADD COLUMN "foto_samping_kiri" text;
ALTER TABLE "motors" ADD COLUMN "foto_samping_kanan" text;
