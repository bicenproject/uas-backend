/*
  Warnings:

  - The values [superadmin,user] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_by` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Barang` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Pembelian` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Penjualan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `DetailPembelian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `DetailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Pembelian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Penjualan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleType_new" AS ENUM ('supervisor', 'admin', 'kasir', 'guest');
ALTER TABLE "akses_user" ALTER COLUMN "role" TYPE "RoleType_new" USING ("role"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";
DROP TYPE "RoleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Barang" DROP COLUMN "created_by",
DROP COLUMN "updated_by",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "harga_beli" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DetailPembelian" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DetailPenjualan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Pembelian" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Penjualan" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pembelian_code_key" ON "Pembelian"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Penjualan_code_key" ON "Penjualan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
