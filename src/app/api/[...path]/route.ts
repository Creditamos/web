import { NextRequest, NextResponse } from "next/server"

const API_URL: string = process.env.API_URL || "http://localhost:3001/api"
const API_KEY: string | undefined = process.env.API_KEY

const FORWARD_HEADERS = ["content-type", "accept"]

async function proxyHandler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await ctx.params
  const pathname = (path ?? []).join("/")
  const target = `${API_URL}/${pathname}${req.nextUrl.search}`

  const headers: Record<string, string> = { "x-api-key": API_KEY ?? "" }
  for (const header of FORWARD_HEADERS) {
    const value = req.headers.get(header)
    if (value) headers[header] = value
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    ...(req.method !== "GET" && req.method !== "HEAD"
      ? { body: await req.arrayBuffer() }
      : {}),
  }

  const upstream = await fetch(target, init)

  const responseHeaders = new Headers()
  for (const header of FORWARD_HEADERS) {
    const value = upstream.headers.get(header)
    if (value) responseHeaders.set(header, value)
  }

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export { proxyHandler as GET, proxyHandler as POST, proxyHandler as PUT, proxyHandler as DELETE }
