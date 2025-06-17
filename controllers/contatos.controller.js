const db = require("../db/database");

exports.create = (req, res) => {
  const { empresa_id, nome, cargo, celular } = req.body;

  if (!empresa_id || !nome || !celular) {
    return res.status(400).json({
      error: "Campos obrigatórios: empresa_id, nome e celular",
    });
  }

  db.get(
    "SELECT * FROM contatos WHERE empresa_id = ? AND celular = ?",
    [empresa_id, celular],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao verificar duplicidade" });
      }

      if (row) {
        return res.status(409).json({
          error: "Celular já cadastrado para essa empresa",
        });
      }

      db.run(
        "INSERT INTO contatos (empresa_id, nome, cargo, celular) VALUES (?, ?, ?, ?)",
        [empresa_id, nome, cargo || null, celular],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(422).json({ error: "Erro ao salvar contato" });
          }
          res.status(201).json({ id: this.lastID });
        }
      );
    }
  );
};

exports.list = (req, res) => {
  const { empresa_id } = req.params;

  if (!empresa_id) {
    return res
      .status(400)
      .json({ error: "ID da empresa é obrigatório" });
  }

  db.all(
    "SELECT * FROM contatos WHERE empresa_id = ?",
    [empresa_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao buscar contatos" });
      }
      res.json(rows);
    }
  );
};

exports.listAll = (req, res) => {
  db.all("SELECT * FROM contatos", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(422).json({ error: "Erro ao listar contatos" });
    }
    res.json(rows);
  });
};

exports.findByCell = (req, res) => {
  const { celular } = req.body;

  if (!celular) {
    return res.status(400).json({ error: "Celular é obrigatório" });
  }

  db.get(
    `SELECT contatos.*, empresas.razao_social AS empresa_nomecompleto, empresas.cnpj AS empresa_cnpj 
     FROM contatos 
     JOIN empresas ON contatos.empresa_id = empresas.id 
     WHERE contatos.celular = ?`,
    [celular],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(422).json({ error: "Erro ao buscar contato" });
      }

      if (!row) {
        return res.status(404).json({
          error: "Contato não encontrado",
          celular: false,
        });
      }

      res.json(row);
    }
  );
};

exports.deleteByIdAndEmpresaId = (req, res) => {
  const { id, empresa_id } = req.params;

  if (!id || !empresa_id) {
    return res.status(400).json({
      error: "Campos obrigatórios: id do contato e id da empresa",
    });
  }

  db.get(
    "SELECT * FROM contatos WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    (err, row) => {
      if (err) {
        console.error(err);
        return res
          .status(422)
          .json({ error: "Erro ao verificar existência do contato" });
      }

      if (!row) {
        return res.status(404).json({
          error: "Contato não encontrado ou não pertence à empresa",
        });
      }

      db.run("DELETE FROM contatos WHERE id = ?", [id], function (err) {
        if (err) {
          console.error(err);
          return res
            .status(422)
            .json({ error: "Erro ao deletar contato" });
        }

        res.json({ message: "Contato deletado com sucesso" });
      });
    }
  );
};
