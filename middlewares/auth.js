const { verifyToken } = require("../utils/jwt"); // usando fast-jwt corretamente

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.rawHeaders["Authorization"]; ;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou formato inválido" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }

  req.user = decoded;
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.is_admin) return next();
  return res.status(403).json({ error: "Acesso negado. Usuário não é administrador." });
};

module.exports = { auth, isAdmin };
