const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function parseDateBrToISO(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

async function getStatusForDateValid(data_validade) {
  const currentDate = new Date();
  const validDate = new Date(data_validade);

  if (validDate < currentDate) {
    return "expired";
  } else if (validDate.getFullYear() - currentDate.getFullYear() < 1) {
    return "expiring";
  } else {
    return "valid";
  }
}

exports.create = async (req, res) => {
  const { empresa_id, nome_certificado, tipo } = req.body;
  let { data_validade } = req.body;
  if (data_validade) {
    data_validade = parseDateBrToISO(data_validade);
  }

  if (!empresa_id)
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  if (!nome_certificado)
    return res.status(400).json({ error: "Nome do certificado é obrigatório" });
  if (!data_validade)
    return res.status(400).json({ error: "Data de validade é obrigatória" });

  if (!tipo) {
    return res.status(400).json({ error: "Tipo do certificado é obrigatório" });
  }

  if (tipo !== "A1" && tipo !== "A3") {
    return res.status(400).json({
      error: "Tipo inválido, deve ser 'A1' ou 'A3'",
    });
  }

  const status = data_validade
    ? getStatusForDateValid(data_validade)
    : "unknown";

  // Verifica se o certificado já existe para a empresa
  const existingCertificado = await prisma.certificados.findFirst({
    where: {
      empresa_id: Number(empresa_id),
      data_validade: data_validade,
    },
  });

  if (existingCertificado) {
    return res.status(422).json({
      error: "Certificado já existe para esta empresa com esta validade !",
    });
  }

  try {
    const novoCertificado = await prisma.certificados.create({
      data: {
        empresa_id: Number(empresa_id),
        nome_certificado,
        data_validade: new Date(data_validade),
        tipo: tipo.toUpperCase(),
        status: status,
      },
    });

    res.status(201).json({ id: novoCertificado.id });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao criar certificado" });
  }
};

exports.list = async (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id)
    return res.status(400).json({ error: "ID da empresa é obrigatório" });

  try {
    const certificados = await prisma.certificados.findMany({
      where: { empresa_id: Number(empresa_id) },
    });

    res.json(certificados);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar certificados" });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ error: "ID do certificado é obrigatório" });

  try {
    const cert = await prisma.certificados.findUnique({
      where: { id: Number(id) },
    });

    if (!cert)
      return res.status(404).json({ error: "Certificado não encontrado" });

    res.json(cert);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar certificado" });
  }
};

exports.update = async (req, res) => {
  const { id, empresa_id, nome_certificado, tipo } = req.body;
  let { data_validade } = req.body;

  if (data_validade) {
    data_validade = parseDateBrToISO(data_validade);
  }

  if (!id) {
    return res.status(400).json({ error: "ID do certificado é obrigatório" });
  }

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }

  if (!nome_certificado) {
    return res.status(400).json({ error: "Nome do certificado é obrigatório" });
  }

  if (!data_validade) {
    return res.status(400).json({ error: "Data de validade é obrigatória" });
  }

  if (!tipo) {
    return res.status(400).json({ error: "Tipo do certificado é obrigatório" });
  }

  if (tipo !== "a1" && tipo !== "a3") {
    return res
      .status(400)
      .json({ error: "Tipo inválido, deve ser 'a1' ou 'a3'" });
  }

  try {
    const cert = await prisma.certificados.update({
      where: { id: Number(id) },
      data: {
        nome_certificado,
        data_validade: new Date(data_validade),
      },
    });

    res.json({ message: "Certificado atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao atualizar certificado" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ error: "ID do certificado é obrigatório" });

  try {
    await prisma.certificados.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Certificado deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao deletar certificado" });
  }
};
