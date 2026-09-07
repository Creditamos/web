import axios, { type AxiosError, type AxiosInstance } from "axios"

export class ApiError extends Error {
  public readonly status: number
  public readonly body: unknown

  public constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname
      const next = pathname.startsWith("/app") ? `?next=${encodeURIComponent(pathname)}` : ""
      window.location.href = `/login${next}`
      return Promise.reject(error)
    }

    const status = error.response?.status ?? 0
    const message = error.response?.data?.message ?? error.message ?? "Erro na API"
    const body = error.response?.data
    return Promise.reject(new ApiError(status, message, body))
  },
)
