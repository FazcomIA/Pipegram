const { getSessionClient } = require("../utils/sessionManager");
const { z } = require("zod");
const BadRequestError = require("../errors/badRequestError");

async function getUserStories(req, res) {
  const schemaBody = z.object({
    username: z.string({ required_error: "username é obrigatório" }),
    targetUsername: z.string({
      required_error: "targetUsername é obrigatório",
    }),
  });

  const { username, targetUsername } = schemaBody.parse(req.body);

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

    return res.json(stories);
  } catch (err) {
    throw new BadRequestError(err.message);
  }
}

module.exports = { getUserStories };
