const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getById = async (req, res) => {
  const { empresa_id, id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "ID do helpdesk é obrigatório" });
  }

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  // Verifica se o helpdesk pertence à empresa
  const helpdeskExists = await prisma.helpdesk.findFirst({
    where: {
      id: Number(id),
      empresa_id: Number(empresa_id),
    },
  });

  if (!helpdeskExists) {
    return res
      .status(404)
      .json({ error: "Helpdesk não encontrado ou não pertence à empresa." });
  }

  try {
    const helpdesk = await prisma.helpdesk.findUnique({
      where: { id: Number(id) },
    });
    if (!helpdesk) {
      return res.status(404).json({ error: "Helpdesk não encontrado" });
    }
    res.json(helpdesk);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar helpdesk", detail: err.message });
  }
};

exports.create = async (req, res) => {
  const { empresa_id, email, senha } = req.body;

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  if (!email || !senha) {
    return res.status(422).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const helpdesk = await prisma.helpdesk.create({
      data: {
        empresa_id: Number(empresa_id),
        email,
        senha,
      },
    });

    res.status(201).json({ id: helpdesk.id });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao criar helpdesk", detail: err.message });
  }
};

exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  try {
    const registros = await prisma.helpdesk.findMany({
      where: { empresa_id: Number(empresa_id) },
    });

    res.json(registros);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar helpdesk", detail: err.message });
  }
};

exports.delete = async (req, res) => {
  const { empresa_id, id } = req.body;

  if (!id) {
    return res.status(422).json({ error: "ID do helpdesk é obrigatório" });
  }

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  // Verifica se o helpdesk pertence à empresa
  const helpdeskExists = await prisma.helpdesk.findFirst({
    where: {
      id: Number(id),
      empresa_id: Number(empresa_id),
    },
  });

  if (!helpdeskExists) {
    return res
      .status(404)
      .json({ error: "Helpdesk não encontrado ou não pertence à empresa." });
  }

  try {
    await prisma.helpdesk.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Helpdesk deletado com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Helpdesk não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao deletar helpdesk", detail: err.message });
  }
};

exports.update = async (req, res) => {
  const { id, empresa_id, email, senha } = req.body;

  if (!id || !empresa_id || !email || !senha) {
    return res.status(422).json({
      error: "ID, empresa_id, email e senha são obrigatórios",
    });
  }

  // Verifica se o helpdesk pertence à empresa
  const helpdeskExists = await prisma.helpdesk.findFirst({
    where: {
      id: Number(id),
      empresa_id: Number(empresa_id),
    },
  });

  if (!helpdeskExists) {
    return res.status(404).json({
      error: "Helpdesk não encontrado ou não pertence à empresa.",
    });
  }

  try {
    await prisma.helpdesk.update({
      where: { id: Number(id) },
      data: {
        empresa_id: Number(empresa_id),
        email,
        senha,
      },
    });

    res.json({
      message: "Helpdesk atualizado com sucesso",
      id: Number(id),
      empresa_id: Number(empresa_id),
      email,
      senha,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Helpdesk não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao atualizar helpdesk", detail: err.message });
  }
};
