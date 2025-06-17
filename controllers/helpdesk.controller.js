const db = require("../db/database");

exports.create = (req, res) => {
  const { empresa_id, email, senha } = req.body;

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  if (!email || !senha) {
    return res.status(422).json({ error: "Email e senha são obrigatórios" });
  }

  db.run(
    "INSERT INTO helpdesk (empresa_id, email, senha) VALUES (?, ?, ?)",
    [empresa_id, email, senha],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
};

exports.list = (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  db.all(
    "SELECT * FROM helpdesk WHERE empresa_id = ?",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(422).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(422).json({ error: "ID do helpdesk é obrigatório" });
  }

  db.run("DELETE FROM helpdesk WHERE id = ?", [id], function (err) {
    if (err) return res.status(422).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(200).json({ error: "Helpdesk não encontrado" });
    }

    res.json({ message: "Helpdesk deletado com sucesso" });
  });
};

exports.update = (req, res) => {
  const { id, empresa_id, email, senha } = req.body;

  if (!id || !empresa_id || !email || !senha) {
    return res.status(422).json({
      error: "ID, empresa_id, email e senha são obrigatórios",
    });
  }

  db.run(
    "UPDATE helpdesk SET empresa_id = ?, email = ?, senha = ? WHERE id = ?",
    [empresa_id, email, senha, id],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(200).json({ error: "Helpdesk não encontrado" });
      }

      res.json({ message: "Helpdesk atualizado com sucesso" });
    }
  );
};
