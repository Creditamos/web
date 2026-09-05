import axios, { type AxiosInstance } from "axios"

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Erro na API"
    return Promise.reject(new Error(message))
  },
)
