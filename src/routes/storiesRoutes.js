const express = require("express");
const router = express.Router();
const { getUserStories } = require("../controllers/storiesController");

router.post("/", getUserStories);

module.exports = router;
