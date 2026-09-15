import type { ReactNode } from "react"
import { Label } from "@/components/label"

interface FormFieldProps {
  htmlFor: string
  label: string
  optional?: boolean
  hint?: string
  children: ReactNode
}

export function FormField({ htmlFor, label, optional, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? <span className="font-normal text-muted-foreground"> (opcional)</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
