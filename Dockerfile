# Painel administrativo Creditamos (Next.js + Bun)
# Contexto de build: raiz do monorepo (dockerfile frontend/web/Dockerfile).
# O app é buildado isolado; o binário do workspace @creditamos/typescript
# (frontend/packages/config/typescript) é pluginado em node_modules para o
# tsconfig/build do Next resolver o extends.

FROM oven/bun:1.4-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
COPY frontend/web/package.json frontend/web/bun.lock ./frontend/web/
COPY frontend/web/biome ./frontend/web/biome
WORKDIR /app/frontend/web
RUN bun install --frozen-lockfile
# tsconfig do web estende @creditamos/typescript/frontend (fora do workspace do web)
COPY frontend/packages/config/typescript ./node_modules/@creditamos/typescript
COPY frontend/web/ ./
RUN bun run build

FROM oven/bun:1.4-alpine AS runtime
WORKDIR /app/frontend/web
ENV NODE_ENV=production
COPY --from=build /app/frontend/web ./
EXPOSE 3000
CMD ["bun", "run", "start"]