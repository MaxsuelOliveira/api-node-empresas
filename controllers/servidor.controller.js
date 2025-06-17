const db = require("../db/database");

exports.create = (req, res) => {
  const { empresa_id, host, user, senha } = req.body;

  if (!host || !user || !senha) {
    return res
      .status(422)
      .json({ error: "Host, usuário e senha são obrigatórios" });
  }

  if (!empresa_id) {
    return res.status(422).json({ error: "ID da empresa é obrigatório" });
  }

  db.run(
    "INSERT INTO servidores (empresa_id, host, user, senha) VALUES (?, ?, ?, ?)",
    [empresa_id, host, user, senha],
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
    "SELECT * FROM servidores WHERE empresa_id = ?",
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
    return res.status(422).json({ error: "ID do servidor é obrigatório" });
  }

  db.run("DELETE FROM servidores WHERE id = ?", [id], function (err) {
    if (err) return res.status(422).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(200).json({ error: "Servidor não encontrado" });
    }

    res.json({ message: "Servidor deletado com sucesso" });
  });
};
