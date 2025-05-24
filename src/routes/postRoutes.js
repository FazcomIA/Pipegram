const express = require("express");
const router = express.Router();
const post = require("../controllers/postController");
const upload = require("../middleware/upload");

router.post("/video-reels", upload.single("video"), post.postVideoReel);
router.post("/video-story", upload.single("video"), post.postVideoStory);
router.post("/video-feed", upload.single("video"), post.postVideoFeed);

router.post("/photo-feed", post.postPhotoFeed);
router.post("/photo-story", post.postPhotoStory);

module.exports = router;
