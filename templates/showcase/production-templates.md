# Google Cloud + Bun Production Templates

Ce répertoire regroupe des architectures prêtes pour la production, intégrant l'écosystème Google et la performance native d'Upstream Bun.

---

## 1. Template : Flutter Web + Cloud Run

### Architecture

- **Frontend** : Application Flutter Web compilée en assets statiques HTML/CanvasKit/WASM.
- **Serveur d'Hôte** : Bun v1.4.4+ servant les assets avec mise en cache agressive (`Cache-Control: public, max-age=31536000, immutable`) et compression gzip/brotli.
- **Déploiement** : Conteneur minimal Cloud Run (`distroless/cc-debian12` ou Alpine + binaire Bun).

### `Dockerfile`

```dockerfile
FROM oven/bun:1.4.4-alpine AS runner
WORKDIR /app
COPY build/web ./public
COPY server.ts ./
EXPOSE 8080
ENV NODE_ENV=production
CMD ["bun", "run", "server.ts"]
```

### `server.ts`

```typescript
Bun.serve({
  port: Number(process.env.PORT) || 8080,
  routes: {
    "/*": { dir: "./public" },
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});
```

---

## 2. Template : Firebase Data Connect + Bun Backend

### Architecture

- **Persistance** : PostgreSQL Cloud SQL managé orchestré par Firebase Data Connect.
- **Service Backend** : API Bun native utilisant `Bun.sql` pour les requêtes ultra-performantes sans ORM lourd, couplé au SDK Data Connect généré.
- **Sécurité** : Contrôle d'accès déclaratif `@auth(level: USER)` dans les schémas GraphQL de Data Connect.

---

## 3. Template : Vertex AI Multi-Modal Pipeline

### Architecture

- **Ingestion** : Fichiers vidéo, audio et documents volumineux streamés directement vers Google Cloud Storage (GCS) sans écriture disque intermédiaire.
- **Traitement Asynchrone** : Publication d'un événement Cloud Pub/Sub déclenchant un worker Cloud Run Bun.
- **Inférence Multimodale** : Appel natif à **Gemini 1.5 Pro** via `google-api-client.ts` avec analyse conjointe du flux audio, des sous-titres et des métadonnées visuelles.
- **Stockage Vectoriel** : Indexation des embeddings textuels et visuels dans Vertex AI Vector Search pour recherche sémantique à faible latence.
