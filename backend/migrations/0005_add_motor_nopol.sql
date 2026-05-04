-- Migration: Tambah kolom nopol (nomor polisi) ke tabel motors
-- Dibutuhkan agar admin bisa mencatat nomor polisi setiap unit motor

ALTER TABLE motors ADD COLUMN IF NOT EXISTS nopol VARCHAR(20);
