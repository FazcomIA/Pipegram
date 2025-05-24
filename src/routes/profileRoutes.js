const express = require("express");
const router = express.Router();
const profile = require("../controllers/profileController"); // <-- esse require precisa estar funcionando

router.post("/update-bio", profile.updateBio);

router.post("/:targetUsername", profile.getProfileByUsername);

module.exports = router;
