const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/db.sqlite");

db.serialize(() => {
  try {
    db.run(`CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razao_social TEXT,
    fantasia TEXT,
    cnpj TEXT,
    observacao TEXT,
    sistema_id TEXT,
    certificado_id TEXT,
    ativa BOOLEAN,
    data_criacao DATE DEFAULT (datetime('now', 'localtime'))
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER,
    codigo TEXT,
    cargo TEXT,
    nome TEXT,
    celular TEXT,
    data_criacao DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS anydesk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER,
    codigo TEXT,
    senha TEXT,
    link TEXT,
    descricao TEXT,
    data_criacao DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS servidores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER,
    host TEXT,
    user TEXT,
    senha TEXT,
    data_criacao DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS helpdesk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER,
    email TEXT,
    senha TEXT,
    data_criacao DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS certificados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER,
    tipo TEXT,
    validade DATE,
    data_criacao DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS sistemas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    tipo TEXT,
    validade DATE,
    ativo BOOLEAN,
    data_criacao DATE DEFAULT (datetime('now', 'localtime'))
  )`);

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error.message);
    throw error;
  }
});

module.exports = db;
