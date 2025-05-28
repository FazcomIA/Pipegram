const {
  loginWithPassword,
  resumeSession,
} = require("../services/instagramClient");
const sessionManager = require("../utils/sessionManager");
const fs = require("fs");
const path = require("path");
const { getSessionClient, saveSession } = require("../utils/sessionManager");
const { z } = require("zod");
const BadRequestError = require("../errors/badRequestError");
const ResourceNotFoundError = require("../errors/resourceNotFound");

const login = async (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "Username é obrigatório." }),
    password: z.string({ required_error: "Password é obrigatório." }),
    proxy: z.string().url().nullable(),
  });

  const { username, password, proxy } = schemaBody.parse(req.body);

  try {
    const { session } = await loginWithPassword(username, password, proxy);
    return res
      .status(200)
      .json({ message: "Login realizado com sucesso", session });
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw new BadRequestError("Falha ao autenticar com o Instagram");
  }
};

const resume = async (req, res) => {
  const schemaBody = z.object({
    username: z.string(),
  });

  const { username } = schemaBody.parse(req.body);
  try {
    const ig = await resumeSession(username);
    return res.status(200).json({ message: "Sessão retomada com sucesso" });
  } catch (error) {
    throw new ResourceNotFoundError("Sessão não encontrada ou inválida");
  }
};

const status = async (req, res) => {
  const schemaBody = z.object({
    username: z.string(),
  });

  const { username } = schemaBody.parse(req.body);
  const exists = sessionManager.sessionExists(username);
  return res.json({ username, status: exists ? "ativa" : "inexistente" });
};

const logout = (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "Username é obrigatório" }),
  });

  const { username } = schemaBody.parse(req.body);

  const success = sessionManager.deleteSession(username);
  if (success) {
    res.json({ message: "Sessão removida com sucesso" });
  } else {
    throw new ResourceNotFoundError("Sessão não encontrada");
  }
};

const importSession = async (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "Username é obrigatório" }),
    session: z.any(),
  });

  const { username, session } = schemaBody.parse(req.body);

  try {
    // Salva o arquivo na pasta sessions
    saveSession(username, session);

    // Tenta carregar a sessão para validar
    const ig = await getSessionClient(username);
    const user = await ig.account.currentUser();

    return res.json({
      message: "Sessão importada com sucesso.",
      logged_in_user: {
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
      },
    });
  } catch (err) {
    throw new BadRequestError(`Erro ao importar sessão: ${err.message}`);
  }
};

module.exports = {
  login,
  resume,
  status,
  logout,
  importSession,
};
