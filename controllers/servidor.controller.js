const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const { empresa_id, host, user, senha } = req.body;

  if (!host || !user || !senha) {
    return res
      .status(422)
      .json({ error: "Host, usuário e senha são obrigatórios" });
  }

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  try {
    const servidor = await prisma.servidores.create({
      data: {
        empresa_id: Number(empresa_id),
        host,
        user,
        senha,
      },
    });
    res.status(201).json({ id: servidor.id });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao criar servidor", detail: err.message });
  }
};

// Listar servidores ordenados por empresa
exports.listAll = async (req, res) => {
  try {
    const servidores = await prisma.servidores.findMany({
      include: {
        empresa: {
          select: {
            id: true,
            razao_social: true,
            cnpj: true,
          },
        },
      },
    });

    // Agrupamento por empresa_id
    const agrupados = servidores.reduce((acc, servidor) => {
      const key = servidor.empresa_id;
      if (!acc[key]) {
        acc[key] = {
          empresa: servidor.empresa,
          servidores: [],
        };
      }
      acc[key].servidores.push(servidor);
      return acc;
    }, {});

    const resultado = Object.values(agrupados);

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao listar servidores", detail: err.message });
  }
};


exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  try {
    const servidores = await prisma.servidores.findMany({
      where: { empresa_id: Number(empresa_id) },
    });
    res.json(servidores);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar servidores", detail: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "ID do servidor é obrigatório" });
  }
  try {
    const servidor = await prisma.servidores.findUnique({
      where: { id: Number(id) },
    });

    if (!servidor) {
      return res.status(404).json({ error: "Servidor não encontrado" });
    }

    res.json(servidor);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar servidor", detail: err.message });
  }
};

exports.update = async (req, res) => {
  const { id, host, user, senha } = req.body;
  if (!id) {
    return res.status(422).json({ error: "ID do servidor é obrigatório" });
  }
  if (!host || !user || !senha) {
    return res
      .status(422)
      .json({ error: "Host, usuário e senha são obrigatórios" });
  }
  try {
    const servidor = await prisma.servidores.update({
      where: { id: Number(id) },
      data: { host, user, senha },
    });
    res.json(servidor);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Servidor não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao atualizar servidor", detail: err.message });
  }
};

exports.delete = async (req, res) => {
  const { empresa_id, id } = req.body;

  if (!id) {
    return res.status(422).json({ error: "ID do servidor é obrigatório" });
  }

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  // Verifica se o servidor pertence à empresa
  const servidor = await prisma.servidores.findFirst({
    where: {
      id: Number(id),
      empresa_id: Number(empresa_id),
    },
  });

  if (!servidor) {
    return res
      .status(404)
      .json({ error: "Servidor não encontrado ou não pertence à empresa." });
  }

  try {
    await prisma.servidores.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Servidor deletado com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Servidor não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao deletar servidor", detail: err.message });
  }
};
