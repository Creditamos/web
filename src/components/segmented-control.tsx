"use client"

import { cn } from "cn"

export interface SegmentOption<Value extends string> {
  value: Value
  label: string
}

interface SegmentedControlProps<Value extends string> {
  options: Array<SegmentOption<Value>>
  value: Value
  onValueChange: (value: Value) => void
  disabled?: boolean
  "aria-label"?: string
  className?: string
  buttonClassName?: string
}

export function SegmentedControl<Value extends string>({
  options,
  value,
  onValueChange,
  disabled = false,
  className,
  buttonClassName,
  ...props
}: SegmentedControlProps<Value>) {
  return (
    <div
      role="group"
      className={cn(
        "inline-grid auto-cols-fr grid-flow-col gap-0.5 rounded-md bg-muted p-0.5",
        disabled && "opacity-60",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "h-8 rounded-[5px] px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none",
              selected
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
              buttonClassName,
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
