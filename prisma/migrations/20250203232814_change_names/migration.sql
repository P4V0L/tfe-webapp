/*
  Warnings:

  - The values [PENDING,PROCESSING,SHIPPED,DELIVERED,CANCELLED,RETURNED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CLOTHING,HABERDASHERY,UNDERWEAR,ACCESSORY,SPORTSWEAR,HOMEWEAR] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CLOTHING_SIZES,UNDERWEAR_SIZES,FOOTWEAR,AGE] on the enum `SizeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO', 'DEVUELTO');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('ROPA', 'MERCERIA', 'ROPA_INTERIOR', 'ACCESORIO', 'ROPA_DEPORTIVA', 'PIJAMAS');
ALTER TABLE "Product" ALTER COLUMN "type" TYPE "ProductType_new" USING ("type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SizeType_new" AS ENUM ('TALLAS_ROPA', 'TALLAS_ROPA_INTERIOR', 'UNIVERSAL', 'CALZADO', 'EDAD');
ALTER TABLE "Product" ALTER COLUMN "allowedSizeTypes" TYPE "SizeType_new"[] USING ("allowedSizeTypes"::text::"SizeType_new"[]);
ALTER TABLE "Size" ALTER COLUMN "type" TYPE "SizeType_new" USING ("type"::text::"SizeType_new");
ALTER TYPE "SizeType" RENAME TO "SizeType_old";
ALTER TYPE "SizeType_new" RENAME TO "SizeType";
DROP TYPE "SizeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
