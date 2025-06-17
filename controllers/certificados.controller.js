const db = require("../db/database");

exports.create = (req, res) => {
  const { empresa_id, nome_certificado, data_validade, ativo } = req.body;

  if (!empresa_id) {
    return res.status(400).json({ error: "ID da empresa é obrigatório" });
  }
  if (!nome_certificado) {
    return res.status(400).json({ error: "Nome do certificado é obrigatório" });
  }
  if (!data_validade) {
    return res.status(400).json({ error: "Data de validade é obrigatória" });
  }
  if (ativo === undefined) {
    return res.status(400).json({ error: "Status ativo é obrigatório" });
  }

  db.run(
    "INSERT INTO certificados (empresa_id, nome_certificado, data_validade, ativo) VALUES (?, ?, ?, ?)",
    [empresa_id, nome_certificado, data_validade, ativo],
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
    "SELECT * FROM certificados WHERE empresa_id = ?",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(422).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.bdoy;

  if (!id) {
    return res.status(400).json({ error: "ID do certificado é obrigatório" });
  }

  db.get("SELECT * FROM certificados WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(422).json({ error: err.message });
    if (!row)
      return res.status(404).json({ error: "Certificado não encontrado" });
    res.json(row);
  });
};

exports.update = (req, res) => {
  const { id, nome_certificado, data_validade, ativo } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID do certificado é obrigatório" });
  }
  if (!nome_certificado) {
    return res.status(400).json({ error: "Nome do certificado é obrigatório" });
  }
  if (!data_validade) {
    return res.status(400).json({ error: "Data de validade é obrigatória" });
  }
  if (ativo === undefined) {
    return res.status(400).json({ error: "Status ativo é obrigatório" });
  }

  db.run(
    "UPDATE certificados SET nome_certificado = ?, data_validade = ?, ativo = ? WHERE id = ?",
    [nome_certificado, data_validade, ativo, id],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Certificado não encontrado" });
      res.json({ message: "Certificado atualizado com sucesso" });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do certificado é obrigatório" });
  }

  db.run("DELETE FROM certificados WHERE id = ?", [id], function (err) {
    if (err) return res.status(422).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Certificado não encontrado" });
    res.json({ message: "Certificado deletado com sucesso" });
  });
};
