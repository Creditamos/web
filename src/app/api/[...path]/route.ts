import { type NextRequest, NextResponse } from "next/server"

const API_URL: string = process.env.API_URL || "http://localhost:3001/api"
const API_KEY: string | undefined = process.env.API_KEY

const SAFE_FORWARD: readonly string[] = [
  "content-type",
  "accept",
  "cookie",
  "origin",
  "x-forwarded-for",
] as const

async function proxyHandler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await ctx.params
  const pathname = (path ?? []).join("/")
  const target = `${API_URL}/${pathname}${req.nextUrl.search}`

  const headers: Record<string, string> = {}

  if (API_KEY) headers["x-api-key"] = API_KEY

  for (const header of SAFE_FORWARD) {
    const value = req.headers.get(header)
    if (value) headers[header] = value
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  headers["x-forwarded-for"] = clientIp

  const init: RequestInit = {
    method: req.method,
    headers,
    ...(req.method !== "GET" && req.method !== "HEAD" ? { body: await req.arrayBuffer() } : {}),
  }

  const upstream = await fetch(target, init)

  const responseHeaders = new Headers()
  const ct = upstream.headers.get("content-type")
  if (ct) responseHeaders.set("content-type", ct)

  const setCookies = upstream.headers.getSetCookie?.() ?? []
  for (const sc of setCookies) {
    responseHeaders.append("set-cookie", sc)
  }

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export { proxyHandler as GET, proxyHandler as POST, proxyHandler as PUT, proxyHandler as DELETE }
