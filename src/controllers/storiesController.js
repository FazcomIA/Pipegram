const { getSessionClient } = require("../utils/sessionManager");

async function getUserStories(req, res) {
  const { username, targetUsername } = req.body;

  if (!username || !targetUsername) {
    return res
      .status(400)
      .json({ error: "username e targetUsername são obrigatórios." });
  }

  try {
    const ig = await getSessionClient(username);
    const user = await ig.user.searchExact(targetUsername);
    const reelsFeed = ig.feed.userStory(user.pk);
    const items = await reelsFeed.items();

    const stories = items.map((item) => {
      let media_url = null;

      if (item.media_type === 1) {
        // Foto
        media_url = item.image_versions2?.candidates?.[0]?.url;
      } else if (item.media_type === 2) {
        // Vídeo
        media_url = item.video_versions?.[0]?.url;
      }

      return {
        username: user.username,
        media_type: item.media_type === 1 ? "photo" : "video",
        taken_at: new Date(item.taken_at * 1000).toISOString(),
        media_url,
      };
    });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getUserStories };
