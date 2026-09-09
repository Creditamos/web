import { existsSync } from "node:fs"
import path from "node:path"
import type { NextConfig } from "next"

// Dentro do Docker o app é buildado isolado (sem o superproject em ../../);
// a raiz de tracing/turbopack só é aplicada quando o monorepo existe.
const monorepoRoot = path.join(__dirname, "../../")
const inMonorepo = existsSync(path.join(monorepoRoot, "package.json"))

const nextConfig: NextConfig = {
  reactCompiler: true,
  // O painel vive sob /app (externo), mantendo a landing na raiz.
  // basePath prefixa rotas E assets (_next) → /app/_next/static, absorvido
  // pelo handler @app do Caddy sem colidir com os assets da landing.
  basePath: "/app",
  ...(inMonorepo
    ? {
        outputFileTracingRoot: monorepoRoot,
        turbopack: { root: monorepoRoot },
      }
    : {}),
}

export default nextConfig
