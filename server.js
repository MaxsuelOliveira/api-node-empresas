require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Configurar pasta de logs
const logsDir = path.join(__dirname, ".logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware simples para logar requisições
app.use((req, res, next) => {
  const now = new Date().toISOString();

  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown IP";

  const userAgent = req.headers["user-agent"] || "unknown user-agent";
  const logLine = `[${now}] ${ip} ${req.method} ${req.url} - ${userAgent}\n`;
  const logFileName = path.join(logsDir, `${now.slice(0, 10)}.log`);

  fs.appendFile(logFileName, logLine, (err) => {
    if (err) console.error("Erro ao salvar log:", err);
  });

  next();
});

// Habilitar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Middlewares
app.use(express.json());

// Servir arquivos estáticos
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/css", express.static(path.join(__dirname, "public/css")));

// Rota principal para servir o arquivo HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Importar rotas
const contatos = require("./routes/contatos.routes");
const anydesk = require("./routes/anydesk.routes");
const servidor = require("./routes/servidor.routes");
const empresas = require("./routes/empresas.routes");
const helpdesk = require("./routes/helpdesk.routes");
const sistemas = require("./routes/sistemas.routes");
const certificados = require("./routes/certificados.routes");

app.use("/empresas", empresas);
app.use("/contatos", contatos);
app.use("/anydesk", anydesk);
app.use("/servidores", servidor);
app.use("/helpdesk", helpdesk);
app.use("/sistemas", sistemas);
app.use("/certificados", certificados);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Tratamento global de erros (middleware)
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(422).json({ error: "Erro interno no servidor" });
});

// Ler HOST e PORT do .env, com fallback
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`SERVER ON -> http://${HOST}:${PORT}`);
});

// Função main (se precisar para outras configurações)
function main() {
  console.log(
    "Função main executada. Configurações iniciais podem ser feitas aqui."
  );
}

main();
