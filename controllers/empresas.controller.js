const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  try {
    let { razao_social, fantasia, cnpj, observacao } = req.body;

    if (!razao_social || !fantasia || !cnpj) {
      return res
        .status(400)
        .json({ error: "Razão Social, Fantasia e CNPJ são obrigatórios" });
    }

    cnpj = cnpj.replace(/[^\d]/g, "");
    if (cnpj.length !== 14) {
      return res
        .status(400)
        .json({ error: "CNPJ inválido. Deve conter 14 dígitos." });
    }

    const empresa = await prisma.empresas.create({
      data: {
        razao_social,
        fantasia,
        cnpj,
        observacao: observacao || "",
        ativa: Boolean(Number(req.body.ativa)),
      },
    });

    res.status(201).json({ id: empresa.id });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const empresas = await prisma.empresas.findMany({
      include: {
        contatos: true,
        anydesk: true,
        servidores: true,
        helpdesk: true,
        sistemas: true,
        certificados: true,
      },
    });
    res.json(empresas);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    // Verificar se o ID existe no banco de dados
    const empresaExists = await prisma.empresas.findUnique({
      where: { id: Number(id) },
    });

    if (!empresaExists) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    const empresa = await prisma.empresas.findUnique({
      where: { id: Number(id) },
      include: {
        contatos: true,
        anydesk: true,
        servidores: true,
        helpdesk: true,
        sistemas: true,
        certificados: true,
      },
    });

    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};

exports.findByCnpjOrNomecompleto = async (req, res) => {
  try {
    const { cnpj, razao_social } = req.body;
    if (!cnpj && !razao_social && cnpj !== "" && razao_social !== "") {
      return res
        .status(400)
        .json({ error: "CNPJ ou Razão Social é obrigatório" });
    }

    const empresa = await prisma.empresas.findFirst({
      where: {
        OR: [{ cnpj: cnpj?.replace(/[^\d]/g, "") }, { razao_social }],
      },
    });

    if (!empresa)
      return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.body;

    const empresa = await prisma.empresas.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Empresa deletada com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { empresa_id, razao_social, fantasia, cnpj } = req.body;

    if (!empresa_id || !razao_social || !fantasia || !cnpj) {
      return res
        .status(400)
        .json({ error: "ID, Razão Social, Fantasia e CNPJ são obrigatórios" });
    }

    const empresa = await prisma.empresas.update({
      where: { id: Number(empresa_id) },
      data: {
        razao_social,
        fantasia,
        cnpj: cnpj.replace(/[^\d]/g, ""),
      },
    });

    res.json({ message: "Empresa atualizada com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }
    console.error(err);
    res.status(422).json({ error: err.message });
  }
};
