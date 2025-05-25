const { getSessionClient } = require("../utils/sessionManager");
const { getUserIdByUsername } = require("../utils/insta");
const axios = require("axios");

const sendTextDM = async (req, res) => {
  const { username, toUsername, message } = req.body;

  if (!username || !toUsername || !message) {
    return res
      .status(400)
      .json({ error: "username, toUsername e message são obrigatórios" });
  }

  try {
    const ig = await getSessionClient(username);
    const userId = await ig.user.getIdByUsername(toUsername);
    const thread = ig.entity.directThread([userId]);
    await thread.broadcastText(message);
    res.json({ message: "Mensagem enviada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInbox = async (req, res) => {
  const { username } = req.body;

  if (!username)
    return res.status(400).json({ error: "Username é obrigatório" });

  try {
    const ig = await getSessionClient(username);
    const inboxFeed = ig.feed.directInbox();
    const threads = await inboxFeed.items();

    const simplifiedThreads = threads.map((thread) => ({
      thread_id: thread.thread_id,
      thread_title: thread.thread_title,
      users: thread.users.map((u) => ({
        username: u.username,
        full_name: u.full_name,
        profile_pic_url: u.profile_pic_url,
      })),
      last_message: thread.last_permanent_item?.text || null,
      last_message_timestamp: thread.last_permanent_item?.timestamp || null,
    }));

    res.json(simplifiedThreads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getThreadMessages = async (req, res) => {
  const { username } = req.body;
  const { threadId } = req.params;

  if (!username || !threadId) {
    return res
      .status(400)
      .json({ error: "username e threadId são obrigatórios" });
  }

  try {
    const ig = await getSessionClient(username);

    // Verificação extra para evitar crashes
    if (typeof threadId !== "string" || threadId.trim() === "") {
      return res.status(400).json({ error: "threadId inválido" });
    }

    const threadFeed = ig.feed.directThread({ thread_id: threadId.trim() });
    const messages = await threadFeed.items();

    res.json({ thread_id: threadId, messages });
  } catch (err) {
    res.status(500).json({
      error: `Erro ao buscar mensagens da thread ${threadId}: ${err.message}`,
    });
  }
};

const sendPhotoDM = async (req, res) => {
  const { username, toUsername, url, base64 } = req.body;

  if (!username || !toUsername || (!url && !base64)) {
    return res.status(400).json({
      error: "username, toUsername e imagem (url ou base64) são obrigatórios",
    });
  }

  try {
    const ig = await getSessionClient(username);
    const userId = await ig.user.getIdByUsername(toUsername);
    const thread = ig.entity.directThread([userId]);

    if (url) {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data);

      if (!buffer || buffer.length === 0) {
        return res
          .status(400)
          .json({ error: "Imagem da URL está vazia ou inválida" });
      }

      await thread.broadcastPhoto({ file: buffer });
    } else {
      const buffer = Buffer.from(base64, "base64");

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: "Imagem base64 inválida" });
      }

      await thread.broadcastPhoto({ file: buffer });
    }

    res.json({ message: "Imagem enviada com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Erro ao enviar imagem por DM: ${err.message}` });
  }
};

module.exports = {
  sendTextDM,
  sendPhotoDM,
  getInbox,
  getThreadMessages,
  getUserIdByUsername,
  getSessionClient,
};
