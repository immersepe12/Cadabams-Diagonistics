import { cn } from "@/lib/utils";

interface StaticPageShellProps {
  title: string;
  overline?: string;
  description?: string;
  /** Body content. Omit to render just the hero header. */
  children?: React.ReactNode;
  /** Optional width override for the body wrapper. Default `max-w-4xl`. */
  bodyMaxWidth?: string;
}

export function StaticPageShell({
  title,
  overline,
  description,
  children,
  bodyMaxWidth = "max-w-4xl",
}: StaticPageShellProps) {
  return (
    <main className={cn("bg-cream-bg", children && "min-h-screen")}>
      <section className="relative overflow-hidden bg-gradient-orange-soft border-b border-cream-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-pill bg-orange-300/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-gutter py-12 lg:py-16">
          {overline && (
            <p className="text-overline uppercase text-orange-600 font-bold mb-2">
              {overline}
            </p>
          )}
          <h1 className="text-display-2 sm:text-display-1 lg:text-[52px] lg:leading-[1.05] font-display font-extrabold text-ink-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-body lg:text-h3 text-ink-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </section>
      {children && (
        <section
          className={cn("mx-auto px-gutter py-10 lg:py-16", bodyMaxWidth)}
        >
          {children}
        </section>
      )}
    </main>
  );
}
