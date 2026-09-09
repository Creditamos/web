"use client"

import { LogOutIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/button"
import { useAuth } from "@/providers/auth.provider"

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function SidebarUser() {
  const auth = useAuth()

  return (
    <div className="space-y-2">
      {auth.admin ? (
        <>
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initialsOf(auth.admin.name)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">{auth.admin.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {auth.admin.roleNames.join(", ")}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              if (!auth.loading) void auth.logout()
            }}
          >
            <LogOutIcon />
            Sair
          </Button>
        </>
      ) : (
        !auth.loading && (
          <Button variant="default" size="sm" className="w-full" render={<Link href="/login" />}>
            Entrar
          </Button>
        )
      )}
    </div>
  )
}
