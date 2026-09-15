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
    <div className="space-y-1">
      {auth.admin ? (
        <>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
              {initialsOf(auth.admin.name)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium">{auth.admin.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {auth.admin.roleNames.join(", ")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Sair"
              aria-label="Sair"
              className="ml-auto shrink-0 text-muted-foreground"
              onClick={() => {
                if (!auth.loading) void auth.logout()
              }}
            >
              <LogOutIcon />
            </Button>
          </div>
        </>
      ) : (
        !auth.loading && (
          <Button variant="outline" size="sm" className="w-full" render={<Link href="/login" />}>
            Entrar
          </Button>
        )
      )}
    </div>
  )
}
