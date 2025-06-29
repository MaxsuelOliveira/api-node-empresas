const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword } = require("../utils/jwt");

async function main() {
  const email = "admin@admin.com";
  const senha = "senha123";

  const exists = await prisma.usuarios.findUnique({ where: { email } });

  if (!exists) {
    const senhaHash = await hashPassword(senha);
    await prisma.usuarios.create({
      data: {
        nome: "Administrador",
        email,
        senha: senhaHash,
        is_admin: true,
      },
    });
    console.log("Usuário admin criado.");
  } else {
    console.log("Usuário admin já existe.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
