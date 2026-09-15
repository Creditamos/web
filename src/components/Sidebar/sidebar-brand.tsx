import Image from "next/image"
import Link from "next/link"

export function SidebarBrand() {
  return (
    <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/images/logo.webp"
          alt="Creditamos"
          width={980}
          height={1081}
          className="h-7 w-auto"
        />
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Creditamos
        </span>
      </Link>
    </div>
  )
}
