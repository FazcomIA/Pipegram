const axios = require("axios");
const { getSessionClient } = require("../utils/sessionManager");

// Função para adicionar atraso
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Função para obter buffer a partir de base64 ou URL
async function bufferFromSource({ base64, url }) {
  if (base64) {
    try {
      const base64Data = base64.split(",")[1] || base64; // Remover prefixo (ex.: "data:image/jpeg;base64,")
      const buffer = Buffer.from(base64Data, "base64");
      if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Base64 inválido ou vazio.");
      }
      return buffer;
    } catch (err) {
      throw new Error("Erro ao decodificar base64: " + err.message);
    }
  }

  if (url) {
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });
        const buffer = Buffer.from(response.data);
        if (!buffer || buffer.length === 0) {
          throw new Error("URL retornou conteúdo vazio.");
        }
        return buffer;
      } catch (err) {
        if (err.response && err.response.status === 429 && retries > 1) {
          retries--;
          await delay(1000 * (4 - retries)); // Atraso de 1s, 2s, 3s
          continue;
        }
        throw new Error("Erro ao baixar mídia da URL: " + err.message);
      }
    }
  }

  throw new Error("Nem base64 nem url fornecidos.");
}

async function postPhotoFeed(req, res) {
  const { username, caption, base64, url } = req.body;
  try {
    const ig = await getSessionClient(username);
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
    const ig = await getSessionClient(username);
    const buffer = await bufferFromSource({ base64, url });
    const result = await ig.publish.story({ file: buffer });
    res.json({ message: "Story publicado", media: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  postPhotoFeed,
  postPhotoStory,
};
