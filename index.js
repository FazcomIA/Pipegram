const express = require("express");
const app = express();
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/docs/swagger.json");
const adminAuthMiddleware = require("./src/middleware/authMiddleware");

const errorHandler = require("./src/utils/errorHandler");

const path = require("path");
const env = require("./src/utils/env");

// Middleware para corpo da requisição
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Rotas protegidas com token admin
app.use("/auth", require("./src/routes/authRoutes"));
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

// Error Handler
app.use(errorHandler);

// Inicia o servidor
const PORT = env.PORT;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
