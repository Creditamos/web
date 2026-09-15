import { existsSync } from "node:fs"
import path from "node:path"
import type { NextConfig } from "next"

// Dentro do Docker o app é buildado isolado (sem o superproject em ../../);
// a raiz de tracing/turbopack só é aplicada quando o monorepo existe.
const monorepoRoot = path.join(__dirname, "../../")
const inMonorepo = existsSync(path.join(monorepoRoot, "package.json"))

const nextConfig: NextConfig = {
  reactCompiler: true,
  // O painel vive no domínio próprio (painel.creditamos.com.br), na raiz do
  // host — sem basePath. A landing (creditamos.com.br) é outro domínio e não
  // colide com rotas ou assets.
  ...(inMonorepo
    ? {
        outputFileTracingRoot: monorepoRoot,
        turbopack: { root: monorepoRoot },
      }
    : {}),
}

export default nextConfig
