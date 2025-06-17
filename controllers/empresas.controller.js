const db = require("../db/database");

exports.create = (req, res) => {
  const { razao_social, fantasia, cnpj, observacao, ativa } = req.body;

  // Formartar cnpj para remover caracteres especiais
  if (cnpj) {
    const formattedCnpj = cnpj.replace(/[^\d]/g, '');
    if (formattedCnpj.length !== 14) {
      return res.status(400).json({ error: "CNPJ inválido. Deve conter 14 dígitos." });
    }
    cnpj = formattedCnpj;
  }

  if (!razao_social || !fantasia || !cnpj) {
    return res.status(400).json({ error: "Razão Social, Fantasia e CNPJ são obrigatórios" });
  }

  db.run(
    `INSERT INTO empresas (razao_social, fantasia, cnpj, observacao, ativa) VALUES (?, ?, ?, ?, ?)`,
    [razao_social, fantasia, cnpj, observacao || '', ativa ?? 1],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
};

exports.list = (req, res) => {
  db.all(`
    SELECT e.*, 
      (SELECT json_group_array(json_object('id', a.id, 'codigo', a.codigo, 'senha', a.senha, 'link', a.link, 'descricao', a.descricao))
       FROM anydesk a WHERE a.empresa_id = e.id) AS anydesks,

      (SELECT json_group_array(json_object('id', c.id, 'cargo', c.cargo, 'nome', c.nome, 'celular', c.celular))
       FROM contatos c WHERE c.empresa_id = e.id) AS contatos,

      (SELECT json_group_array(json_object('id', s.id, 'host', s.host, 'user', s.user, 'senha', s.senha))
       FROM servidores s WHERE s.empresa_id = e.id) AS servidores,

      (SELECT json_group_array(json_object('id', h.id, 'email', h.email, 'senha', h.senha))
       FROM helpdesk h WHERE h.empresa_id = e.id) AS helpdesk,

      (SELECT json_group_array(json_object('id', s.id, 'nome', s.nome, 'tipo', s.tipo, 'validade', s.validade , 'ativo', s.ativo))
       FROM sistemas s WHERE s.id = e.sistema_id) AS sistemas,
       
      (SELECT json_group_array(json_object('id', x.id, 'validade', x.validade, 'tipo', x.tipo))
       FROM certificados x WHERE x.id = e.certificado_id) AS certificados

    FROM empresas e
  `, [], (err, rows) => {
    if (err) return res.status(422).json({ error: err.message });

    const data = rows.map((e) => ({
      ...e,
      anydesks: JSON.parse(e.anydesks || "[]"),
      contatos: JSON.parse(e.contatos || "[]"),
      servidores: JSON.parse(e.servidores || "[]"),
      helpdesk: JSON.parse(e.helpdesk || "[]"),
      sistemas: JSON.parse(e.sistemas || "[]"),
      certificados: JSON.parse(e.certificados || "[]"),
    }));

    res.json(data);
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "ID da empresa é obrigatório" });

  db.get(`
    SELECT e.*,
      (SELECT json_group_array(json_object('id', a.id, 'codigo', a.codigo, 'senha', a.senha, 'link', a.link, 'descricao', a.descricao))
       FROM anydesk a WHERE a.empresa_id = e.id) AS anydesks,

      (SELECT json_group_array(json_object('id', c.id, 'nome', c.nome, 'celular', c.celular))
       FROM contatos c WHERE c.empresa_id = e.id) AS contatos,

      (SELECT json_group_array(json_object('id', s.id, 'host', s.host, 'user', s.user, 'senha', s.senha))
       FROM servidores s WHERE s.empresa_id = e.id) AS servidores,

      (SELECT json_group_array(json_object('id', h.id, 'email', h.email, 'senha', h.senha))
       FROM helpdesk h WHERE h.empresa_id = e.id) AS helpdesk,

      (SELECT json_group_array(json_object('id', s.id, 'nome', s.nome, 'tipo', s.tipo, 'validade', s.validade , 'ativo', s.ativo))
       FROM sistemas s WHERE s.id = e.sistema_id) AS sistemas,

      (SELECT json_group_array(json_object('id', x.id, 'validade', x.validade, 'tipo', x.tipo))
       FROM certificados x WHERE x.id = e.certificado_id) AS certificados



    FROM empresas e WHERE e.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(422).json({ error: err.message });
    if (!row) return res.status(200).json({ error: "Empresa não encontrada" });

    res.json({
      ...row,
      anydesks: JSON.parse(row.anydesks || "[]"),
      contatos: JSON.parse(row.contatos || "[]"),
      servidores: JSON.parse(row.servidores || "[]"),
      helpdesk: JSON.parse(row.helpdesk || "[]"),
      sistemas: JSON.parse(row.sistemas || "[]"),
      certificados: JSON.parse(row.certificados || "[]"),
    });
  });
};

exports.findByCnpjOrNomecompleto = (req, res) => {
  const { cnpj, razao_social } = req.body;

  if (!cnpj && !razao_social) {
    return res.status(400).json({ error: "CNPJ ou Razão Social é obrigatório" });
  }

  db.get(
    `SELECT * FROM empresas WHERE cnpj = ? OR razao_social = ?`,
    [cnpj || '', razao_social || ''],
    (err, row) => {
      if (err) return res.status(422).json({ error: err.message });
      if (!row) return res.status(200).json({ error: "Empresa não encontrada" });
      res.json(row);
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "ID da empresa é obrigatório" });

  db.run(`DELETE FROM empresas WHERE id = ?`, [id], function (err) {
    if (err) return res.status(422).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(200).json({ error: "Empresa não encontrada" });
    }
    res.json({ message: "Empresa deletada com sucesso" });
  });
};

exports.update = (req, res) => {
  const { empresa_id, razao_social, fantasia, cnpj } = req.body;

  if (!empresa_id || !razao_social || !fantasia || !cnpj) {
    return res.status(400).json({ error: "ID, Razão Social, Fantasia e CNPJ são obrigatórios" });
  }

  db.run(
    `UPDATE empresas SET razao_social = ?, fantasia = ?, cnpj = ? WHERE id = ?`,
    [razao_social, fantasia, cnpj, empresa_id],
    function (err) {
      if (err) return res.status(422).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(200).json({ error: "Empresa não encontrada" });
      }
      res.json({ message: "Empresa atualizada com sucesso" });
    }
  );
};