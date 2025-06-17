const db = require("../db/database");

exports.create = (req, res) => {
  const { codigo, senha, link, descricao } = req.body;
  const { empresa_id } = req.params;

  if (!empresa_id || !codigo || !senha || !link || !descricao) {
    return res.status(400).json({
      error: "Código, senha, link, descrição e ID da empresa são obrigatórios",
    });
  }

  db.run(
    "INSERT INTO anydesk (empresa_id, codigo, senha, link, descricao) VALUES (?, ?, ?, ?, ?)",
    [empresa_id, codigo, senha, link, descricao],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao inserir registro" });
      }
      res.json({ id: this.lastID });
    }
  );
};

exports.list = (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }

  db.all(
    "SELECT * FROM anydesk WHERE empresa_id = ?",
    [empresa_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao buscar registros" });
      }
      res.json(rows);
    }
  );
};

exports.delete = (req, res) => {
  const { id, empresa_id } = req.body;

  if (!id || !empresa_id) {
    return res
      .status(400)
      .json({ error: "ID do anydesk e ID da empresa são obrigatórios" });
  }

  db.get(
    "SELECT id FROM anydesk WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao apagar o anydesk." });
      }
      if (!row) {
        return res.status(404).json({ error: "Anydesk não encontrado, ou não percece a essa empresa." });
      }
    }
  );

  db.run(
    "DELETE FROM anydesk WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao apagar anydesk" });
      }
      res.json({ deleted: this.changes });
    }
  );
};

exports.update = (req, res) => {
  const { id, codigo, senha, link, descricao } = req.body;

  if (!codigo || !senha || !link || !descricao) {
    return res
      .status(400)
      .json({ error: "Código, senha, link e descrição são obrigatórios" });
  }

  db.run(
    "UPDATE anydesk SET codigo = ?, senha = ?, link = ?, descricao = ? WHERE id = ?",
    [codigo, senha, link, descricao, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao atualizar registro" });
      }
      res.json({ updated: this.changes });
    }
  );
};
