const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  try {
    const { empresa_id, nome, cargo, celular } = req.body;

    if (!empresa_id || !nome || !celular) {
      return res.status(400).json({
        error: "Campos obrigatórios: empresa_id, nome e celular",
      });
    }

    // Verificar se a empresa existe
    const empresa = await prisma.empresas.findUnique({
      where: { id: Number(empresa_id) },
    });
    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    const duplicado = await prisma.contatos.findFirst({
      where: {
        empresa_id: Number(empresa_id),
        celular,
      },
    });

    if (duplicado) {
      return res.status(409).json({
        error: "Celular já cadastrado para essa empresa",
      });
    }

    const novo = await prisma.contatos.create({
      data: {
        empresa_id: Number(empresa_id),
        nome,
        cargo: cargo || null,
        celular,
      },
    });

    res.status(201).json({ id: novo.id });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao salvar contato" });
  }
};

exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }

  try {
    const contatos = await prisma.contatos.findMany({
      where: { empresa_id: Number(empresa_id) },
    });
    res.json(contatos);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar contatos" });
  }
};

exports.listAll = async (req, res) => {
  try {
    const contatos = await prisma.contatos.findMany();
    res.json(contatos);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao listar contatos" });
  }
};

exports.findByCell = async (req, res) => {
  const { celular } = req.body;

  if (!celular) {
    return res.status(400).json({ error: "Celular é obrigatório" });
  }

  try {
    const contato = await prisma.contatos.findFirst({
      where: { celular },
      include: {
        empresa: {
          select: {
            razao_social: true,
            cnpj: true,
          },
        },
      },
    });

    if (!contato) {
      return res.status(404).json({
        error: "Contato não encontrado",
        celular: false,
      });
    }

    res.json({
      ...contato,
      empresa_nomecompleto: contato.empresa.razao_social,
      empresa_cnpj: contato.empresa.cnpj,
    });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar contato" });
  }
};

exports.deleteByIdAndEmpresaId = async (req, res) => {
  const { id, empresa_id } = req.params;

  if (!id || !empresa_id) {
    return res.status(400).json({
      error: "Campos obrigatórios: id do contato e id da empresa",
    });
  }

  try {
    const contato = await prisma.contatos.findFirst({
      where: {
        id: Number(id),
        empresa_id: Number(empresa_id),
      },
    });

    if (!contato) {
      return res.status(404).json({
        error: "Contato não encontrado ou não pertence à empresa",
      });
    }

    await prisma.contatos.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Contato deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao deletar contato" });
  }
};
