const { getSessionClient } = require("./sessionManager");

function decodeMediaId(shortcode) {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let mediaId = 0;

  for (let i = 0; i < shortcode.length; i++) {
    mediaId = mediaId * 64 + alphabet.indexOf(shortcode[i]);
  }

  return mediaId.toString();
}

async function getMediaIdFromUrl(url) {
  const match = url.match(/\/p\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    throw new Error("URL inválida. Deve conter /p/{shortcode}/");
  }
  const shortcode = match[1];
  return decodeMediaId(shortcode);
}

async function getUserIdByUsername(username, targetUsername) {
  const ig = await getSessionClient(username);
  const user = await ig.user.searchExact(targetUsername);
  return user.pk;
}

module.exports = {
  getMediaIdFromUrl,
  getUserIdByUsername,
};
