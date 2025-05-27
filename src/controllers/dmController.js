const { getSessionClient } = require("../utils/sessionManager");
const { getUserIdByUsername } = require("../utils/insta");
const axios = require("axios");
const { z } = require("zod");
const BadRequestError = require("../errors/badRequestError");

const sendTextDM = async (req, res) => {
  const schemaBody = z.object({
    username: z.string(),
    toUsername: z.string(),
    message: z.string(),
  });

  const { username, toUsername, message } = schemaBody.parse(req.body);

  try {
    const ig = await getSessionClient(username);
    const userId = await ig.user.getIdByUsername(toUsername);
    const thread = ig.entity.directThread([userId]);
    await thread.broadcastText(message);
    return res.json({ message: "Mensagem enviada com sucesso" });
  } catch (err) {
    throw new BadRequestError(err.message);
  }
};

const getInbox = async (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "Username é obrigatório" }),
  });

  const { username } = schemaBody.parse(req.body);

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

    return res.json(simplifiedThreads);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
};

const getThreadMessages = async (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "username é obrigatório" }),
  });

  const schemaParams = z.object({
    threadId: z.string({ required_error: "threadId é obrigatório" }),
  });

  const { username } = schemaBody.parse(req.body);
  const { threadId } = schemaParams.parse(req.params);

  try {
    const ig = await getSessionClient(username);

    // Verificação extra para evitar crashes
    if (typeof threadId !== "string" || threadId.trim() === "") {
      return res.status(400).json({ error: "threadId inválido" });
    }

    const threadFeed = ig.feed.directThread({ thread_id: threadId.trim() });
    const messages = await threadFeed.items();

    return res.json({ thread_id: threadId, messages });
  } catch (err) {
    throw new BadRequestError(
      `Erro ao buscar mensagens da thread ${threadId}: ${err.message}`
    );
  }
};

const sendPhotoDM = async (req, res) => {
  const schemaBody = z
    .object({
      username: z.string({ required_error: "username é obrigatório" }),
      toUsername: z.string({ required_error: "toUsername é obrigatório" }),
      url: z.string().url().optional(),
      base64: z.string().base64().optional(),
    })
    .refine((data) => data.base64 !== undefined || data.url !== undefined, {
      message: "Você deve informar ao menos base64 ou url",
      path: ["url", "base64"],
    });

  const { username, toUsername, url, base64 } = schemaBody.parse(req.body);

  try {
    const ig = await getSessionClient(username);
    const userId = await ig.user.getIdByUsername(toUsername);
    const thread = ig.entity.directThread([userId]);

    if (url) {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data);

      if (!buffer || buffer.length === 0)
        throw new BadRequestError("Imagem da URL está vazia ou inválida");

      await thread.broadcastPhoto({ file: buffer });
    } else {
      const buffer = Buffer.from(base64, "base64");

      if (!buffer || buffer.length === 0)
        throw new BadRequestError("Imagem base64 inválida");

      await thread.broadcastPhoto({ file: buffer });
    }

    return res.json({ message: "Imagem enviada com sucesso" });
  } catch (err) {
    throw new BadRequestError(`Erro ao enviar imagem por DM: ${err.message}`);
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
