const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  comparePassword,
  generateToken,
  hashPassword,
} = require("../utils/jwt");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({ where: { email } });

    if (!usuario || !(await comparePassword(senha, usuario.senha))) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const token = generateToken({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      is_admin: usuario.is_admin,
    });

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      is_admin: usuario.is_admin,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};

exports.create = async (req, res) => {
  const { nome, email, is_admin, senha } = req.body;

  if (!nome || !email || !senha || is_admin === undefined) {
    return res.status(400).json({
      error: "Nome, email, senha e is_admin são obrigatórios",
    });
  }

  try {
    const senhaHash = await hashPassword(senha);

    const user = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        is_admin,
      },
    });

    res.status(201).json({ id: user.id });
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao inserir usuário" });
  }
};

exports.list = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany();

    const usuariosSemSenha = usuarios.map((usuario) => {
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        is_admin: usuario.is_admin,
      };
    });

    res.json(usuariosSemSenha);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "Erro ao buscar registros" });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(422).json({ error: "ID do usuário é obrigatório" });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao buscar usuário", detail: err.message });
  }
};

exports.update = async (req, res) => {
  const { id, nome, email, is_admin, senha } = req.body;

  if (!id) {
    return res.status(422).json({ error: "ID do usuário é obrigatório" });
  }

  try {
    const usuario = await prisma.usuarios.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        is_admin,
        senha: senha ? await hashPassword(senha) : undefined,
      },
    });

    res.json(usuario);
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao atualizar usuário", detail: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(422).json({ error: "ID do usuário é obrigatório" });
  }

  try {
    await prisma.usuarios.delete({
      where: { id: Number(id) },
    });

    // Excluindo o token do usuário, se necessário !
    res.status(204).send({
      message: "Usuário excluído com sucesso",
      id: Number(id),
      status: "deleted",
    });
  } catch (err) {
    console.error(err);
    res
      .status(422)
      .json({ error: "Erro ao excluir usuário", detail: err.message });
  }
};
