"use client"

import type { LucideIcon } from "lucide-react"
import {
  BanknoteIcon,
  ContactIcon,
  FileTextIcon,
  FolderTreeIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar as SidebarPrimitive } from "@/components/SidebarPrimitives"

interface NavLink {
  href: string
  label: string
  icon: LucideIcon
  match: (pathname: string) => boolean
}

const sections: Array<{ label: string; links: NavLink[] }> = [
  {
    label: "Visão geral",
    links: [
      {
        href: "/",
        label: "Painel",
        icon: LayoutDashboardIcon,
        match: (pathname) => pathname === "/",
      },
    ],
  },
  {
    label: "Comercial",
    links: [
      {
        href: "/clients",
        label: "Clientes",
        icon: UsersIcon,
        match: (pathname) => pathname === "/clients" || pathname.startsWith("/clients/"),
      },
      {
        href: "/proposals",
        label: "Propostas",
        icon: FileTextIcon,
        match: (pathname) => pathname === "/proposals" || pathname.startsWith("/proposals/"),
      },
      {
        href: "/products",
        label: "Produtos",
        icon: FolderTreeIcon,
        match: (pathname) => pathname === "/products" || pathname.startsWith("/products/"),
      },
    ],
  },
  {
    label: "Administração",
    links: [
      {
        href: "/suppliers",
        label: "Fornecedores",
        icon: BanknoteIcon,
        match: (pathname) => pathname === "/suppliers" || pathname.startsWith("/suppliers/"),
      },
      {
        href: "/operators",
        label: "Operadores",
        icon: ContactIcon,
        match: (pathname) => pathname === "/operators" || pathname.startsWith("/operators/"),
      },
      {
        href: "/users",
        label: "Usuários",
        icon: UsersIcon,
        match: (pathname) => pathname === "/users" || pathname.startsWith("/users/"),
      },
      {
        href: "/roles",
        label: "Perfis & Acessos",
        icon: LockKeyholeIcon,
        match: (pathname) => pathname === "/roles" || pathname.startsWith("/roles/"),
      },
      {
        href: "/classifications",
        label: "Classificações",
        icon: FolderTreeIcon,
        match: (pathname) => pathname === "/classifications",
      },
    ],
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
      {sections.map((section) => (
        <SidebarPrimitive.Group key={section.label}>
          <SidebarPrimitive.GroupLabel className="h-6 pt-4 pb-1 text-[11px] font-medium text-sidebar-foreground/50">
            {section.label}
          </SidebarPrimitive.GroupLabel>
          <SidebarPrimitive.Menu>
            {section.links.map(({ href, label, icon: Icon, match }) => {
              const isActive = match(pathname)
              return (
                <SidebarPrimitive.MenuItem key={href}>
                  <SidebarPrimitive.MenuButton
                    render={<Link href={href} />}
                    isActive={isActive}
                    tooltip={label}
                    aria-current={isActive ? "page" : undefined}
                    size="sm"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarPrimitive.MenuButton>
                </SidebarPrimitive.MenuItem>
              )
            })}
          </SidebarPrimitive.Menu>
        </SidebarPrimitive.Group>
      ))}
    </>
  )
}
