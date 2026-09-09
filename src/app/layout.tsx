import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "../styles/styles.css"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/providers/auth.provider"
import { QueryProvider } from "@/providers/query.provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Creditamos - Painel",
  description: "Plataforma de gestão de propostas de crédito",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <QueryProvider>
            <Sidebar>
              <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </div>
              <Footer />
            </Sidebar>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
