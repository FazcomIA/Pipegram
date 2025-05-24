const express = require("express");
const router = express.Router();
const dm = require("../controllers/dmController");

router.post("/send", dm.sendTextDM);
router.post("/inbox", dm.getInbox);
router.post("/thread/:threadId", dm.getThreadMessages);
router.post("/send-photo", dm.sendPhotoDM);

module.exports = router;
