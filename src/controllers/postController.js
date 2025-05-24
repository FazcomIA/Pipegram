const { resumeSession } = require("../services/instagramClient");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

function bufferFromSource({ base64, url, file }) {
  if (base64) return Buffer.from(base64, "base64");
  if (url)
    return axios
      .get(url, { responseType: "arraybuffer" })
      .then((r) => Buffer.from(r.data));
  if (file) return fs.readFileSync(file);
  throw new Error("Fonte de mídia não especificada.");
}

async function postPhotoFeed(req, res) {
  const { username, caption, base64, url } = req.body;
  try {
    const ig = await resumeSession(username);
    const buffer = await bufferFromSource({ base64, url });
    const publishResult = await ig.publish.photo({ file: buffer, caption });
    res.json({ message: "Foto publicada no Feed", media: publishResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postPhotoStory(req, res) {
  const { username, base64, url } = req.body;
  try {
    const ig = await resumeSession(username);
    const buffer = await bufferFromSource({ base64, url });
    const result = await ig.publish.story({ file: buffer });
    res.json({ message: "Story publicado", media: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postVideoReel(req, res) {
  const { username, caption } = req.body;
  const file = req.file;

  if (!username || !file) {
    return res.status(400).json({ error: "username e vídeo são obrigatórios" });
  }

  try {
    const ig = await resumeSession(username);
    const result = await ig.publish.reelVideo({
      video: file.buffer,
      caption: caption || "",
    });
    res.json({ message: "Reels postado com sucesso", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postVideoReel(req, res) {
  const { username, caption } = req.body;
  const file = req.file;

  if (!username || !file) {
    return res.status(400).json({ error: "username e vídeo são obrigatórios" });
  }

  try {
    const ig = await resumeSession(username);
    const result = await ig.publish.reelVideo({
      video: file.buffer,
      caption: caption || "",
    });
    res.json({ message: "Reels publicado com sucesso", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function postVideoStory(req, res) {
  const { username, base64, url } = req.body;
  const file = req.file; // se for via multipart/form-data

  try {
    const ig = getSessionClient(username);
    let videoBuffer = null;

    if (base64) {
      videoBuffer = Buffer.from(base64, "base64");
    } else if (file) {
      videoBuffer = fs.readFileSync(file.path);
    } else if (url) {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      videoBuffer = Buffer.from(response.data, "binary");
    }

    if (!videoBuffer) {
      return res.status(400).json({ error: "Nenhum vídeo fornecido." });
    }

    const publishResult = await ig.publish.storyVideo({
      video: videoBuffer,
    });

    res.json({ success: true, result: publishResult });
  } catch (error) {
    console.error("Erro ao postar vídeo nos stories:", error);
    res.status(500).json({ error: error.message });
  }
}

async function postVideoFeed(req, res) {
  const { username, caption } = req.body;
  const file = req.file;

  if (!username || !file) {
    return res.status(400).json({ error: "username e vídeo são obrigatórios" });
  }

  try {
    const ig = await resumeSession(username);
    const result = await ig.publish.video({
      video: file.buffer,
      caption: caption || "",
    });
    res.json({ message: "Vídeo publicado no Feed", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  postVideoReel,
  postVideoStory,
  postVideoFeed,
  postPhotoFeed,
  postPhotoStory,
};
