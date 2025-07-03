const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function parseDateBrToISO(isoDateStr) {
  if (!isoDateStr) return "";
  const d = new Date(isoDateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getStatusForDateValid(data) {
  const today = new Date();
  const validade = new Date(data);

  if (isNaN(validade.getTime())) return "unknown";

  return validade < today ? "expired" : "valid";
}

exports.create = async (req, res) => {
  const { empresa_id, nome_certificado, tipo, data_validade } = req.body;

  if (!empresa_id)
    return res.status(400).json({ error: "ID da empresa é obrigatório" });

  if (!nome_certificado)
    return res.status(400).json({ error: "Nome do certificado é obrigatório" });

  if (!data_validade)
    return res.status(400).json({ error: "Data de validade é obrigatória" });

  if (!tipo)
    return res.status(400).json({ error: "Tipo do certificado é obrigatório" });

  if (!["A1", "A3"].includes(tipo.toUpperCase())) {
    return res
      .status(400)
      .json({ error: "Tipo inválido, deve ser 'A1' ou 'A3'" });
  }

  const isoDate = new Date(data_validade);
  if (isNaN(isoDate.getTime())) {
    return res.status(400).json({ error: "Data de validade inválida" });
  }

  const status = getStatusForDateValid(data_validade) || "unknown";

  try {
    const existing = await prisma.certificados.findFirst({
      where: {
        empresa_id: Number(empresa_id),
        data_validade: isoDate,
      },
    });

    if (existing) {
      return res.status(422).json({
        error: "Já existe certificado para essa empresa com essa validade.",
      });
    }

    const novoCertificado = await prisma.certificados.create({
      data: {
        empresa_id: Number(empresa_id),
        nome_certificado,
        data_validade: new Date(data_validade),
        tipo: tipo.toUpperCase(),
        status: status, // Aqui deve estar como string!
      },
    });

    return res.status(201).json({ id: novoCertificado.id });
  } catch (err) {
    console.error("Erro ao criar certificado:", err);
    return res.status(500).json({ error: "Erro ao criar certificado" });
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

// Listar todos os certificados ordenados por empresa, quero retonor o nome da empresa, cnpj
exports.listAll = async (req, res) => {
  try {
    const registros = await prisma.certificados.findMany({
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

    const agrupado = registros.reduce((acc, cert) => {
      const key = cert.empresa_id;
      if (!acc[key]) {
        acc[key] = {
          empresa: cert.empresa,
          certificados: [],
        };
      }
      acc[key].certificados.push(cert);
      return acc;
    }, {});

    const resultado = Object.values(agrupado);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao listar certificados" });
  }
};

// Buscar certificados que estão expirados ou prestes a expirar no geral
exports.listExpiring = async (req, res) => {
  try {
    const currentDate = new Date();
    const expiringCerts = await prisma.certificados.findMany({
      where: {
        OR: [
          {
            data_validade: {
              lt: currentDate,
            },
          },
          {
            data_validade: {
              gte: currentDate,
              lt: new Date(
                currentDate.getFullYear() + 1,
                currentDate.getMonth(),
                currentDate.getDate()
              ),
            },
          },
        ],
      },
      orderBy: {
        data_validade: "asc",
      },
    });
    res.json(expiringCerts);
  } catch (err) {
    console.error(err);
    res.status(422).json({
      error: "Erro ao buscar certificados expirados ou prestes a expirar",
    });
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
