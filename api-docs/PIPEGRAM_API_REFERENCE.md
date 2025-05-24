# 📸 Pipegram - API Não Oficial do Instagram

![Logo Pipegram](https://i.imgur.com/kKHUeGh.png)

**Pipegram** é uma API **não oficial** do Instagram desenvolvida para automatizar ações comuns em contas do Instagram, com suporte a **múltiplas sessões simultâneas**. Criada com Node.js e `instagram-private-api`, é ideal para automações, bots, agendamentos e ferramentas de gestão de conteúdo.

## ✅ Funcionalidades

### 📌 Autenticação

- `POST /auth/login`  
  Autentica uma nova conta do Instagram e salva a sessão.

  ```json
  {
    "username": "conta_insta",
    "password": "senha_segura",
    "proxy": "http://proxy:porta" // opcional
  }
  ```

- `POST /auth/resume`  
  Importa uma sessão JSON existente.

  ```json
  {
    "username": "conta_insta",
    "session": { ... } // conteúdo da sessão
  }
  ```

- `GET /auth/status`  
  Verifica se uma sessão está ativa.

  ```json
  {
    "username": "conta_insta"
  }
  ```

- `DELETE /auth/delete`  
  Deleta a sessão de uma conta.
  ```json
  {
    "username": "conta_insta"
  }
  ```

---

### 📝 Postagens

- `POST /post/photo-feed`
- `POST /post/photo-story`

  ```json
  {
    "username": "conta_insta",
    "caption": "Legenda da foto/vídeo",
    "file": "base64_ou_url_ou_caminho_local"
  }
  ```

---

### 👤 Perfil

- `GET /profile/{targetUsername}`  
  Busca informações públicas de um perfil.

- `POST /profile/update-bio`  
  Atualiza a biografia ou foto de perfil.
  ```json
  {
    "username": "conta_insta",
    "bio": "Nova biografia",
    "photo": "base64_ou_url" // opcional
  }
  ```

---

## 🔐 Autenticação

A API usa um token fixo de autenticação definido no `.env`:

```
ADMIN_TOKEN=seu_token_seguro
```

Todas as requisições devem incluir:

```
Authorization: Bearer seu_token_seguro
```

---

## 🐳 Docker

A API pode ser facilmente executada com Docker. Verifique os arquivos `Dockerfile` e `docker-compose.yml` no projeto.

---

## 🧠 Observações

- É necessário usar com moderação para evitar restrições do Instagram.
- A API simula comportamento humano, mas ainda assim pode ser rastreada pelo Instagram.
- Ideal para automações internas, bots, testes, protótipos ou agendamentos de conteúdo.

---

Desenvolvido com ❤️ por Mateus Gomes.
