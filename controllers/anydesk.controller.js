const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const { empresa_id, senha, descricao } = req.body;
  let { codigo } = req.body;

  if (!empresa_id || !codigo || !senha || !descricao) {
    return res.status(400).json({
      error:
        "Código anydesk, senha padrão, descrição e ID da empresa são obrigatórios",
    });
  }

  // Verifica se o código já existe
  const existingAnydesk = await prisma.anydesk.findFirst({
    where: {
      empresa_id: Number(empresa_id),
      codigo,
    },
  });

  if (existingAnydesk) {
    return res.status(400).json({
      error: "Código anydesk já cadastrado para esta empresa",
    });
  }

  // Gera o link do anydesk
  codigo = codigo.replace(/[^a-zA-Z0-9]/g, ""); // Remove caracteres especiais

  try {
    const anydesk = await prisma.anydesk.create({
      data: {
        empresa_id: Number(empresa_id),
        codigo,
        senha,
        link: `https://anydesk.com/${codigo}`,
        descricao,
      },
    });

    res.status(201).json({ id: anydesk.id });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao inserir registro" });
  }
};

exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }

  try {
    const registros = await prisma.anydesk.findMany({
      where: { empresa_id: Number(empresa_id) },
    });

    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar registros" });
  }
};

// Listar todos os registros de anydesk orderados por empresa e 
exports.listAll = async (req, res) => {
  try {
    const registros = await prisma.anydesk.findMany({
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

    // Agrupar registros por empresa
    const agrupadosPorEmpresa = registros.reduce((acc, registro) => {
      const empresaId = registro.empresa.id;

      if (!acc[empresaId]) {
        acc[empresaId] = {
          empresa: registro.empresa,
          anydesk: [],
        };
      }

      acc[empresaId].anydesk.push(registro);

      return acc;
    }, {});

    // Converter objeto para array
    const resultado = Object.values(agrupadosPorEmpresa);

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao listar registros" });
  }
}

exports.delete = async (req, res) => {
  const { id, empresa_id } = req.body;

  if (!id || !empresa_id) {
    return res
      .status(400)
      .json({ error: "ID do anydesk e ID da empresa são obrigatórios" });
  }

  try {
    const registro = await prisma.anydesk.findFirst({
      where: {
        id: Number(id),
        empresa_id: Number(empresa_id),
      },
    });

    if (!registro) {
      return res
        .status(404)
        .json({ error: "Anydesk não encontrado ou não pertence à empresa." });
    }

    await prisma.anydesk.delete({
      where: { id: Number(id) },
    });

    res.json({ deleted: 1 });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao apagar anydesk" });
  }
};

exports.update = async (req, res) => {
  const { id, codigo, senha, link, descricao } = req.body;

  if (!id || !codigo || !senha || !link || !descricao) {
    return res.status(400).json({
      error: "ID, código, senha, link e descrição são obrigatórios",
    });
  }

  try {
    const updated = await prisma.anydesk.update({
      where: { id: Number(id) },
      data: {
        codigo,
        senha,
        link,
        descricao,
      },
    });

    res.json({ updated: 1 });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao atualizar registro" });
  }
};
