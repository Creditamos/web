import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { href: "/", label: "Painel" },
  { href: "/clients", label: "Clientes" },
  { href: "/proposals", label: "Propostas" },
]

export function Header() {
  return (
    <header className="border-b border-border bg-white dark:bg-secondary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
        <nav className="flex items-center gap-1">
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
    </header>
  )
}
