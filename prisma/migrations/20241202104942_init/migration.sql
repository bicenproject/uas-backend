/*
  Warnings:

  - You are about to drop the column `company_name` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `tax_number` on the `Supplier` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('superadmin', 'admin', 'user');

-- AlterEnum
ALTER TYPE "StockMovementType" ADD VALUE 'TRANSFER';

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "company_name",
DROP COLUMN "tax_number",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "total_stock" INTEGER;

-- AlterTable
ALTER TABLE "WarehouseStock" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "alamat" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "akses_user" (
    "id_akses" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "role" "RoleType" NOT NULL,
    "code" TEXT NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "akses_user_pkey" PRIMARY KEY ("id_akses")
);

-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "harga_beli" TEXT NOT NULL,
    "harga_jual" TEXT NOT NULL,
    "stock" INTEGER,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembelian" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "tanggal_pembelian" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPembelian" (
    "id" SERIAL NOT NULL,
    "harga_beli" TEXT NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "id_pembelian" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "DetailPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "id" SERIAL NOT NULL,
    "id_customer" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPenjualan" (
    "id" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "id_penjualan" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_jual" TEXT NOT NULL,

    CONSTRAINT "DetailPenjualan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "akses_user_code_key" ON "akses_user"("code");

-- AddForeignKey
ALTER TABLE "akses_user" ADD CONSTRAINT "akses_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_pembelian_fkey" FOREIGN KEY ("id_pembelian") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_id_penjualan_fkey" FOREIGN KEY ("id_penjualan") REFERENCES "Penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
