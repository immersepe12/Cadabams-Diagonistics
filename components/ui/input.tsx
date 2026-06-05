import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-input bg-cream-soft px-3 py-2 text-body-sm text-ink-900 shadow-sm transition-[color,box-shadow,background-color] outline-none",
        "placeholder:text-ink-400 selection:bg-orange-500 selection:text-white",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-orange-500 focus-visible:bg-cream-card focus-visible:ring-4 focus-visible:ring-orange-100",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
