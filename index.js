const express = require("express");
const app = express();
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/docs/swagger.json");
const adminAuthMiddleware = require("./src/middleware/authMiddleware");

const path = require("path");

// Middleware para corpo da requisição
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Rotas protegidas com token admin
app.use("/auth", adminAuthMiddleware, require("./src/routes/authRoutes"));
app.use("/post", adminAuthMiddleware, require("./src/routes/postRoutes"));
app.use("/profile", adminAuthMiddleware, require("./src/routes/profileRoutes"));
app.use("/dm", adminAuthMiddleware, require("./src/routes/dmRoutes"));

app.use("/stories", adminAuthMiddleware, require("./src/routes/storiesRoutes"));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz
app.get("/", (req, res) => {
  res.send("🚀 API do Instagram não oficial (multi sessões) está rodando!");
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
