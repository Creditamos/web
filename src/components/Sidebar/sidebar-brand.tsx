import Image from "next/image"
import Link from "next/link"

export function SidebarBrand() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 px-5">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/app/images/logo.webp"
          alt="Creditamos"
          width={980}
          height={1081}
          className="h-9 w-auto"
        />
        <span className="text-lg font-bold tracking-tight">Creditamos</span>
      </Link>
    </div>
  )
}
