-- Migration: Tambah kolom nopol (nomor polisi) di tabel transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS motor_nopol VARCHAR(20);
