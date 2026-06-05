import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-cream-soft px-3 py-2 text-body-sm text-ink-900 shadow-sm transition-[color,box-shadow,background-color] outline-none resize-y field-sizing-content",
        "placeholder:text-ink-400 selection:bg-orange-500 selection:text-white",
        "focus-visible:border-orange-500 focus-visible:bg-cream-card focus-visible:ring-4 focus-visible:ring-orange-100",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
