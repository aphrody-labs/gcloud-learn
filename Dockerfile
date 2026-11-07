# syntax=docker/dockerfile:1
FROM oven/bun:canary-alpine AS base
WORKDIR /app

COPY package.json tsconfig.json bunfig.toml ./
RUN bun install --frozen-lockfile || bun install

COPY . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["bun", "run", "api/server.ts"]
