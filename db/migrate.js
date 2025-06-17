const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.resolve(__dirname, ".", "db.sqlite");
const BACKUP_DIR = path.resolve(__dirname, ".", "backups");

function backupDatabase() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.]/g, "")
    .slice(0, 15);
  const backupPath = path.join(BACKUP_DIR, `db_${timestamp}.sqlite`);
  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`Backup criado em: ${backupPath}`);
}

function migrate() {
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db.exec("BEGIN TRANSACTION;", (err) => {
      if (err) throw err;

      const migrationSQL = `
        CREATE TABLE empresas_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          razao_social TEXT,
          fantasia TEXT,
          cnpj TEXT,
          observacao TEXT,
          sistema_id TEXT,
          certificado_id TEXT,
          ativa BOOLEAN DEFAULT 1,
          data_criacao DATE DEFAULT (datetime('now', 'localtime'))
        );

        INSERT INTO empresas_new (id, razao_social, fantasia, cnpj)
        SELECT id, razao_social, fantasia, cnpj FROM empresas;

        DROP TABLE empresas;

        ALTER TABLE empresas_new RENAME TO empresas;
      `;

      db.exec(migrationSQL, (err) => {
        if (err) {
          console.error("Erro na migração:", err.message);
          db.exec("ROLLBACK;", () => {
            console.error("Transação revertida.");
            db.close();
          });
          return;
        }

        db.exec("COMMIT;", (err) => {
          if (err) {
            console.error("Erro no commit da transação:", err.message);
          } else {
            console.log("Migração concluída com sucesso!");
          }
          db.close();
        });
      });
    });
  });
}

try {
  backupDatabase();
  migrate();
} catch (error) {
  console.error("Falha no processo:", error.message);
}