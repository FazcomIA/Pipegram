<p align="center">
  <img src="https://i.imgur.com/zbmYf2q.png" width="200" alt="Pipegram Logo" />
</p>

# Pipegram 🚀

**Pipegram** é uma API REST **não oficial** do Instagram, desenvolvida com Node.js e baseada na biblioteca `instagram-private-api`. Ela oferece uma interface poderosa e simples para interagir com o Instagram de forma automatizada por meio de endpoints HTTP.

> ⚠️ Este projeto **não utiliza a API oficial do Instagram** e pode estar sujeito a mudanças ou bloqueios por parte da Meta/Instagram. Use por sua conta e risco, respeitando os termos de uso da plataforma.

---

## 📦 Funcionalidades

A Pipegram permite aos usuários autenticarem e automatizarem ações em suas contas do Instagram. Atualmente, a API conta com os seguintes módulos e rotas:

### ✅ Autenticação

- `POST /auth/login` — Login com username e senha
- `POST /auth/resume` — Retoma sessão a partir de arquivo salvo
- `GET /auth/status` — Verifica status da sessão
- `DELETE /auth/delete` — Exclui a sessão ativa
- `POST /auth/login-session` — Login com JSON de sessão existente

### 🖼 Postagens

- `POST /post/photo-feed` — Publicar imagem no feed
- `POST /post/photo-story` — Publicar imagem nos stories
- `POST /post/video-feed` — Publicar vídeo no feed
- `POST /post/video-story` — Publicar vídeo nos stories
- `POST /post/video-reels` — Publicar vídeo no Reels

### 👤 Perfil

- `GET /profile/{targetUsername}` — Ver perfil público de outro usuário
- `POST /profile/update-bio` — Atualiza bio e imagem de perfil

## 🔐 Segurança

Todas as rotas são protegidas por um token **admin** definido no `.env.example`:
