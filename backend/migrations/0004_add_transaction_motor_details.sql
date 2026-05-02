-- Migration: Tambah kolom detail motor di tabel transactions
-- Admin menginput manual merk, tipe, warna, tahun motor di form transaksi

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS motor_merk VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS motor_tipe VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS motor_warna VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS motor_tahun INTEGER;
