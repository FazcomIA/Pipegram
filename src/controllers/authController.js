const {
  loginWithPassword,
  resumeSession,
} = require("../services/instagramClient");
const sessionManager = require("../utils/sessionManager");
const fs = require("fs");
const path = require("path");
const { getSessionClient, saveSession } = require("../utils/sessionManager");

const login = async (req, res) => {
  const { username, password, proxy } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username e password são obrigatórios." });
  }

  try {
    const { session } = await loginWithPassword(username, password, proxy);
    res.status(200).json({ message: "Login realizado com sucesso", session });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({ error: "Falha ao autenticar com o Instagram" });
  }
};

const resume = async (req, res) => {
  const { username } = req.body;
  try {
    const ig = await resumeSession(username);
    res.status(200).json({ message: "Sessão retomada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Sessão não encontrada ou inválida" });
  }
};

const status = async (req, res) => {
  const { username } = req.body;
  const exists = sessionManager.sessionExists(username);
  res.json({ username, status: exists ? "ativa" : "inexistente" });
};

const logout = (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ error: "Username é obrigatório" });

  const success = sessionManager.deleteSession(username);
  if (success) {
    res.json({ message: "Sessão removida com sucesso" });
  } else {
    res.status(404).json({ error: "Sessão não encontrada" });
  }
};

const importSession = async (req, res) => {
  const { username, session } = req.body;

  if (!username || !session) {
    return res
      .status(400)
      .json({ error: "username e session (JSON) são obrigatórios." });
  }

  try {
    // Salva o arquivo na pasta sessions
    saveSession(username, session);

    // Tenta carregar a sessão para validar
    const ig = await getSessionClient(username);
    const user = await ig.account.currentUser();

    res.json({
      message: "Sessão importada com sucesso.",
      logged_in_user: {
        username: user.username,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao importar sessão: " + err.message });
  }
};

module.exports = {
  login,
  resume,
  status,
  logout,
  importSession,
};
