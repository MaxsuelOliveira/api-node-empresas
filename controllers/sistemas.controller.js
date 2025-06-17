const db = require("../db/database");

exports.create = (req, res) => {
  const { empresa_id, nome_sistema, versao, ativo } = req.body;

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }
  if (!nome_sistema) {
    return res.status(400).json({ error: "Nome do sistema é obrigatório" });
  }
  if (!versao) {
    return res.status(400).json({ error: "Versão do sistema é obrigatória" });
  }
  if (ativo === undefined) {
    return res.status(400).json({ error: "Status ativo é obrigatório" });
  }

  db.run(
    "INSERT INTO sistemas (empresa_id, nome_sistema, versao, ativo) VALUES (?, ?, ?, ?)",
    [empresa_id, nome_sistema, versao, ativo],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
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
    "SELECT * FROM sistemas WHERE empresa_id = ?",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(422).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID do sistema é obrigatório" });
  }

  db.get(
    "SELECT * FROM sistemas WHERE id = ?",
    [id],
    (err, row) => {
      if (err) return res.status(422).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Sistema não encontrado" });
      res.json(row);
    }
  );
};

exports.update = (req, res) => {
  const { id, nome_sistema, versao, ativo } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID do sistema é obrigatório" });
  }
  if (!nome_sistema) {
    return res.status(400).json({ error: "Nome do sistema é obrigatório" });
  }
  if (!versao) {
    return res.status(400).json({ error: "Versão do sistema é obrigatória" });
  }
  if (ativo === undefined) {
    return res.status(400).json({ error: "Status ativo é obrigatório" });
  }

  db.run(
    "UPDATE sistemas SET nome_sistema = ?, versao = ?, ativo = ? WHERE id = ?",
    [nome_sistema, versao, ativo, id],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Sistema não encontrado" });
      res.json({ message: "Sistema atualizado com sucesso" });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID do sistema é obrigatório" });
  }

  db.run("DELETE FROM sistemas WHERE id = ?", [id], function (err) {
    if (err) return res.status(422).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Sistema não encontrado" });
    res.json({ message: "Sistema deletado com sucesso" });
  });
};
