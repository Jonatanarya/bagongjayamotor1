-- Migration: Tambah kolom warna ke tabel motors
-- Dibutuhkan agar admin bisa mencatat warna setiap unit motor

ALTER TABLE motors ADD COLUMN IF NOT EXISTS warna VARCHAR(100);
