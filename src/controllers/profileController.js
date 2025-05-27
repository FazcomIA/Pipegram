const axios = require("axios");
const { getSessionClient } = require("../utils/sessionManager");
const { getUserIdByUsername } = require("../utils/insta");
const { z } = require("zod");
const BadRequestError = require("../errors/badRequestError");

const updateBio = async (req, res) => {
  const schemaBody = z.object({
    username: z.string({ required_error: "username é obrigatório" }),
    bio: z.string().optional(),
    url: z.string().url().optional(),
    base64: z.string().base64().optional(),
  });

  const { username, bio, base64, url } = schemaBody.parse(req.body);

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

    return res.json({
      message: "Bio e/ou foto de perfil atualizadas com sucesso",
    });
  } catch (err) {
    throw new BadRequestError(`Erro ao atualizar bio/foto: ${err.message}`);
  }
};

const getProfileByUsername = async (req, res) => {
  const schemaBody = z.object({
    username: z.string(),
  });

  const schemaParams = z.object({
    targetUsername: z.string(),
  });

  const { username } = schemaBody.parse(req.body);
  const { targetUsername } = schemaParams.parse(req.params);

  try {
    const ig = await getSessionClient(username);
    const id = await ig.user.getIdByUsername(targetUsername);
    const profile = await ig.user.info(id);
    return res.json(profile);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
};

module.exports = {
  updateBio,
  getProfileByUsername,
};
