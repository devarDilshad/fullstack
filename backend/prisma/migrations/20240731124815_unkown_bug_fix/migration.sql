-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoice_status" TEXT NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "order_status" TEXT NOT NULL DEFAULT 'Pending';
