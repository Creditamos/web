"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/Button"
import { useAuth } from "@/providers/auth-provider"

const navLinks = [
  { href: "/", label: "Painel" },
  { href: "/clients", label: "Clientes" },
  { href: "/proposals", label: "Propostas" },
]

export function Header() {
  const { admin, loading, logout } = useAuth()

  return (
    <header className="border-b border-border bg-white dark:bg-secondary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.webp"
              alt="Creditamos"
              width={980}
              height={1081}
              className="h-9 w-auto"
            />
            <span className="text-xl font-bold tracking-tight">Creditamos</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {admin ? (
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="text-sm font-medium">{admin.name}</span>
              <span className="text-xs text-muted-foreground">{admin.role}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!loading) void logout()
              }}
            >
              Sair
            </Button>
          </div>
        ) : (
          !loading && (
            <Button variant="default" size="sm" render={<Link href="/login" />}>
              Entrar
            </Button>
          )
        )}
      </div>
    </header>
  )
}
