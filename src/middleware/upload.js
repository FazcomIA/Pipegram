const multer = require("multer");

const storage = multer.memoryStorage(); // Arquivo vai como buffer para o controller
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // até 100MB
  },
});

module.exports = upload;
