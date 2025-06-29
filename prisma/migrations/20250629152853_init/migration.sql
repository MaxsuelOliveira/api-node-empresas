-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresas" (
    "id" SERIAL NOT NULL,
    "razao_social" TEXT,
    "fantasia" TEXT,
    "cnpj" TEXT,
    "observacao" TEXT,
    "sistema_id" TEXT,
    "certificado_id" TEXT,
    "ativa" BOOLEAN,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contatos" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "codigo" TEXT,
    "cargo" TEXT,
    "nome" TEXT,
    "celular" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anydesk" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "codigo" TEXT,
    "senha" TEXT,
    "link" TEXT,
    "descricao" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anydesk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servidores" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "host" TEXT,
    "user" TEXT,
    "senha" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Helpdesk" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "email" TEXT,
    "senha" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Helpdesk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificados" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "tipo" TEXT,
    "validade" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sistemas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "tipo" TEXT,
    "validade" TIMESTAMP(3),
    "ativo" BOOLEAN,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- AddForeignKey
ALTER TABLE "Contatos" ADD CONSTRAINT "Contatos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anydesk" ADD CONSTRAINT "Anydesk_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servidores" ADD CONSTRAINT "Servidores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Helpdesk" ADD CONSTRAINT "Helpdesk_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificados" ADD CONSTRAINT "Certificados_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
