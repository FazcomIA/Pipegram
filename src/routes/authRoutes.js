const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/login", auth.login);
router.post("/resume", auth.resume);
router.post("/status", auth.status);
router.post("/delete", auth.logout);
router.post("/import-session", auth.importSession);

module.exports = router;
