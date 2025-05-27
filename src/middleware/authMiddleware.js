const env = require("../utils/env");

require("dotenv").config();

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticação ausente" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Token inválido" });
  }

  next();
};

module.exports = adminAuthMiddleware;
