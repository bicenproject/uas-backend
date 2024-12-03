/*
  Warnings:

  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `akses_user` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarehouseStock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_product_id_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseStock" DROP CONSTRAINT "WarehouseStock_product_id_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseStock" DROP CONSTRAINT "WarehouseStock_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "akses_user" DROP CONSTRAINT "akses_user_id_user_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role_id",
DROP COLUMN "supplier_id",
DROP COLUMN "warehouse_id",
ADD COLUMN     "akses_user_id" INTEGER;

-- AlterTable
ALTER TABLE "akses_user" DROP COLUMN "id_user";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "StockMovement";

-- DropTable
DROP TABLE "Warehouse";

-- DropTable
DROP TABLE "WarehouseStock";

-- DropEnum
DROP TYPE "StockMovementType";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_akses_user_id_fkey" FOREIGN KEY ("akses_user_id") REFERENCES "akses_user"("id_akses") ON DELETE SET NULL ON UPDATE CASCADE;
