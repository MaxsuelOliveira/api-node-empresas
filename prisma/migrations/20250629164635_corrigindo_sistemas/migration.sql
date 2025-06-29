/*
  Warnings:

  - You are about to drop the column `certificado_id` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `sistema_id` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `data_criacao` on the `Sistemas` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Sistemas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Sistemas` table. All the data in the column will be lost.
  - You are about to drop the column `validade` on the `Sistemas` table. All the data in the column will be lost.
  - Made the column `razao_social` on table `Empresas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fantasia` on table `Empresas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnpj` on table `Empresas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ativa` on table `Empresas` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `empresa_id` to the `Sistemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_sistema` to the `Sistemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `versao` to the `Sistemas` table without a default value. This is not possible if the table is not empty.
  - Made the column `ativo` on table `Sistemas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Empresas" DROP COLUMN "certificado_id",
DROP COLUMN "sistema_id",
ALTER COLUMN "razao_social" SET NOT NULL,
ALTER COLUMN "fantasia" SET NOT NULL,
ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "ativa" SET NOT NULL,
ALTER COLUMN "ativa" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Sistemas" DROP COLUMN "data_criacao",
DROP COLUMN "nome",
DROP COLUMN "tipo",
DROP COLUMN "validade",
ADD COLUMN     "empresa_id" INTEGER NOT NULL,
ADD COLUMN     "nome_sistema" TEXT NOT NULL,
ADD COLUMN     "versao" TEXT NOT NULL,
ALTER COLUMN "ativo" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sistemas" ADD CONSTRAINT "Sistemas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
