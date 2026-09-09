"use client"

import type { LucideIcon } from "lucide-react"
import { FileTextIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar as SidebarPrimitive } from "@/components/SidebarPrimitives"

const navLinks: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Painel", icon: LayoutDashboardIcon },
  { href: "/clients", label: "Clientes", icon: UsersIcon },
  { href: "/proposals", label: "Propostas", icon: FileTextIcon },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarPrimitive.Group>
      <SidebarPrimitive.Menu>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <SidebarPrimitive.MenuItem key={href}>
              <SidebarPrimitive.MenuButton
                render={<Link href={href} />}
                isActive={isActive}
                tooltip={label}
                aria-current={isActive ? "page" : undefined}
                className="hover:bg-primary! hover:text-primary-foreground! data-active:bg-primary! data-active:text-primary-foreground!"
              >
                <Icon />
                <span>{label}</span>
              </SidebarPrimitive.MenuButton>
            </SidebarPrimitive.MenuItem>
          )
        })}
      </SidebarPrimitive.Menu>
    </SidebarPrimitive.Group>
  )
}
