/*
  Warnings:

  - You are about to drop the column `validade` on the `Certificados` table. All the data in the column will be lost.
  - Added the required column `nome_certificado` to the `Certificados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Certificados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificados" DROP COLUMN "validade",
ADD COLUMN     "data_validade" TIMESTAMP(3),
ADD COLUMN     "nome_certificado" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
