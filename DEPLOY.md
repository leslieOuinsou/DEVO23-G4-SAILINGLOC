# Déploiement gratuit (Neon + Cloudflare Pages + Zeabur / SnapDeploy)

## 1. Neon

- Crée un projet sur https://neon.tech
- Copie `DATABASE_URL` (avec `?sslmode=require`)

Variables sur le **backend** :

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
USE_HTTPS=false
PORT=3000
SECRET_KEY=change-me-long-secret
EXPIRATION_TIME=24h
APPLICATION_URL=https://TON-PROJET.pages.dev
```

Migrations (local, une fois) :

```bash
cd back
# .env avec DATABASE_URL et NODE_ENV=production
npm install
npm run migrate:prod
```

## 2. Zeabur ou SnapDeploy (dossier `back`)

- Start : `npm start`
- Ou Docker : `back/Dockerfile.prod`
- Note l’URL publique de l’API

## 3. Cloudflare Pages (dossier `front`)

| Réglage | Valeur |
|---------|--------|
| Build | `npm ci && npm run build` |
| Output | `dist` |

Variables **build** :

```env
VITE_API_URL=https://TON-API.zeabur.app/api/v1
VITE_API_BASE_URL=https://TON-API.zeabur.app
```

Puis mets `APPLICATION_URL` sur le back = URL Pages exacte.

## 4. Secours soutenance

```bash
docker compose up
cloudflared tunnel --url http://localhost:5173
```

Uploads : disque éphémère sur free tier — OK pour démo.
