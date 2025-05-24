const axios = require("axios");
const { getSessionClient } = require("../utils/sessionManager");
const { getUserIdByUsername } = require("../utils/insta");

const updateBio = async (req, res) => {
  const { username, bio, base64, url } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username é obrigatório" });
  }

  try {
    const ig = await getSessionClient(username);
    const currentProfile = await ig.account.currentUser();

    // Atualiza a bio se fornecida
    if (bio) {
      await ig.account.editProfile({
        full_name: currentProfile.full_name,
        external_url: currentProfile.external_url || "",
        phone_number: currentProfile.phone_number || "",
        username: currentProfile.username,
        biography: bio,
        email: currentProfile.email || "",
      });
    }

    // Atualiza a foto de perfil se fornecida
    if (base64 || url) {
      let buffer = null;

      if (base64) {
        buffer = Buffer.from(base64, "base64");
      } else if (url) {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        buffer = Buffer.from(response.data);
      }

      if (buffer) {
        await ig.account.changeProfilePicture(buffer);
      }
    }

    res.json({ message: "Bio e/ou foto de perfil atualizadas com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Erro ao atualizar bio/foto: ${err.message}` });
  }
};

const getProfileByUsername = async (req, res) => {
  const { username } = req.body; // da sessão
  const { targetUsername } = req.params; // do perfil que queremos buscar

  if (!username || !targetUsername) {
    return res
      .status(400)
      .json({ error: "username e targetUsername são obrigatórios" });
  }

  try {
    const ig = await getSessionClient(username);
    const id = await ig.user.getIdByUsername(targetUsername);
    const profile = await ig.user.info(id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  updateBio,
  getProfileByUsername,
};
