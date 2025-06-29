const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const nomeValido = ["PROTON", "HIPER", "TECHSOFT"];
exports.create = async (req, res) => {
  const { empresa_id, nome_sistema, versao, ativo } = req.body;

  if (!empresa_id)
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  if (!nome_sistema)
    return res.status(400).json({ error: "Nome do sistema é obrigatório" });
  if (!nomeValido.includes(nome_sistema.toUpperCase())) {
    return res.status(400).json({
      error: "Nome do sistema inválido. Deve ser PROTON, HIPER ou TECHSOFT",
    });
  }
  // if (!versao) return res.status(400).json({ error: "Versão do sistema é obrigatória" });
  if (ativo === undefined)
    return res.status(400).json({ error: "Status ativo é obrigatório" });

  try {
    const sistema = await prisma.sistemas.create({
      data: {
        empresa_id: Number(empresa_id),
        nome_sistema: nome_sistema.toUpperCase(),
        versao: "1",
        ativo: Boolean(ativo),
      },
    });
    res.status(201).json({ id: sistema.id });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao criar sistema", detail: err.message });
  }
};

exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id)
    return res.status(400).json({ error: "ID da empresa é obrigatório" });

  try {
    const sistemas = await prisma.sistemas.findMany({
      where: { empresa_id: Number(empresa_id) },
    });
    res.json(sistemas);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao listar sistemas", detail: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({ error: "ID do sistema é obrigatório" });

  try {
    const sistema = await prisma.sistemas.findUnique({
      where: { id: Number(id) },
    });

    if (!sistema)
      return res.status(404).json({ error: "Sistema não encontrado" });

    res.json(sistema);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar sistema", detail: err.message });
  }
};

exports.update = async (req, res) => {
  const { id, nome_sistema, versao, ativo } = req.body;

  if (!id)
    return res.status(400).json({ error: "ID do sistema é obrigatório" });
  if (!nome_sistema)
    return res.status(400).json({ error: "Nome do sistema é obrigatório" });
  if (!versao)
    return res.status(400).json({ error: "Versão do sistema é obrigatória" });
  if (ativo === undefined)
    return res.status(400).json({ error: "Status ativo é obrigatório" });

  try {
    const sistema = await prisma.sistemas.update({
      where: { id: Number(id) },
      data: {
        nome_sistema,
        versao,
        ativo: Boolean(ativo),
      },
    });

    res.json({ message: "Sistema atualizado com sucesso", sistema });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Sistema não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao atualizar sistema", detail: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({ error: "ID do sistema é obrigatório" });

  try {
    await prisma.sistemas.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Sistema deletado com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Sistema não encontrado" });
    }
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao deletar sistema", detail: err.message });
  }
};
