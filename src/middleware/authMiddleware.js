const env = require("../utils/env");
const UnauthorizedError = require("../errors/unauthorizedError");
const ForbiddenError = require("../errors/forbiddenError");

require("dotenv").config();

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de autenticação ausente");
  }

  const token = authHeader.split(" ")[1];

  if (token !== env.ADMIN_TOKEN) {
    throw new ForbiddenError("Token inválido");
  }

  next();
};

module.exports = adminAuthMiddleware;
