"use client"

import type { ReactNode } from "react"

import { Sidebar as SidebarPrimitive } from "@/components/SidebarPrimitives"
import { SidebarBrand } from "./sidebar-brand"
import { SidebarNav } from "./sidebar-nav"
import { SidebarUser } from "./sidebar-user"

function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarPrimitive.Provider>
      <SidebarPrimitive>
        <SidebarPrimitive.Header className="p-0">
          <SidebarBrand />
        </SidebarPrimitive.Header>
        <SidebarPrimitive.Content>
          <SidebarNav />
        </SidebarPrimitive.Content>
        <SidebarPrimitive.Footer>
          <SidebarUser />
        </SidebarPrimitive.Footer>
      </SidebarPrimitive>
      <SidebarPrimitive.Inset>{children}</SidebarPrimitive.Inset>
    </SidebarPrimitive.Provider>
  )
}

export const Sidebar = Object.assign(SidebarLayout, {
  Brand: SidebarBrand,
  Nav: SidebarNav,
  User: SidebarUser,
  Trigger: SidebarPrimitive.Trigger,
})
