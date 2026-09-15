import { cn } from "cn"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/input"

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  containerClassName?: string
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-8 pr-2.5 pl-8", className)} {...props} />
    </div>
  )
}
