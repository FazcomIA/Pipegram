const { IgApiClient } = require("instagram-private-api");
const { getSessionClient } = require("./sessionManager");

/**
 * Extrai o shortcode da URL do Instagram
 */
function extractShortcode(url) {
  const regex = /(?:\/p\/|\/reel\/|\/tv\/)([a-zA-Z0-9_-]{5,})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Converte uma URL de postagem em media_id
 * Necessita de sessão para resolver o shortcode
 */
async function getMediaIdFromUrl(url, username) {
  const shortcode = extractShortcode(url);
  if (!shortcode) throw new Error("Shortcode inválido na URL");

  const ig = await getSessionClient(username);
  const mediaInfo = await ig.media.infoByShortcode(shortcode);
  return mediaInfo.id;
}

module.exports = {
  getMediaIdFromUrl,
};
