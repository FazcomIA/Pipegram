const express = require("express");
const router = express.Router();
const post = require("../controllers/postController");
const upload = require("../middleware/upload");

router.post("/photo-feed", post.postPhotoFeed);
router.post("/photo-story", post.postPhotoStory);

module.exports = router;
