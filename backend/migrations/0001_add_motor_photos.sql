-- Add photo fields to sell_requests table for storing 5 different motor photos
ALTER TABLE "sell_requests" ADD COLUMN "foto_depan" text;
ALTER TABLE "sell_requests" ADD COLUMN "foto_belakang" text;
ALTER TABLE "sell_requests" ADD COLUMN "foto_samping_kiri" text;
ALTER TABLE "sell_requests" ADD COLUMN "foto_samping_kanan" text;
ALTER TABLE "sell_requests" ADD COLUMN "foto_stnk_bpkb" text;
