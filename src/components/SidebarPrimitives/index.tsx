import { SidebarContent } from "./sidebar-content"
import { SidebarFooter } from "./sidebar-footer"
import { SidebarGroup } from "./sidebar-group"
import { SidebarGroupAction } from "./sidebar-group-action"
import { SidebarGroupContent } from "./sidebar-group-content"
import { SidebarGroupLabel } from "./sidebar-group-label"
import { SidebarHeader } from "./sidebar-header"
import { SidebarInput } from "./sidebar-input"
import { SidebarInset } from "./sidebar-inset"
import { SidebarMenu } from "./sidebar-menu"
import { SidebarMenuAction } from "./sidebar-menu-action"
import { SidebarMenuBadge } from "./sidebar-menu-badge"
import { SidebarMenuButton, sidebarMenuButtonVariants } from "./sidebar-menu-button"
import { SidebarMenuItem } from "./sidebar-menu-item"
import { SidebarMenuSkeleton } from "./sidebar-menu-skeleton"
import { SidebarMenuSub } from "./sidebar-menu-sub"
import { SidebarMenuSubButton } from "./sidebar-menu-sub-button"
import { SidebarMenuSubItem } from "./sidebar-menu-sub-item"
import { SidebarProvider, useSidebar } from "./sidebar-provider"
import { SidebarRail } from "./sidebar-rail"
import { SidebarRoot } from "./sidebar-root"
import { SidebarSeparator } from "./sidebar-separator"
import { SidebarTrigger } from "./sidebar-trigger"

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Provider: SidebarProvider,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Inset: SidebarInset,
  Input: SidebarInput,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Separator: SidebarSeparator,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  useSidebar,
  menuButtonVariants: sidebarMenuButtonVariants,
})
