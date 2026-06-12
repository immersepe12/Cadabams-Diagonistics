import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Some lab-test entries in labtests.json were authored elsewhere and got
 * imported with markdown-active characters backslash-escaped (e.g. `\*\*Bold\*\*`
 * instead of `**Bold**`, `\* item` instead of `* item`). ReactMarkdown correctly
 * renders those as literal characters, so headings/lists/bold never appear.
 * This unescapes the common markdown syntax characters so the data renders as
 * intended without editing the source files.
 */
function unescapeMarkdown(input: string): string {
  return input.replace(/\\([*_`#\[\]()>~|-])/g, "$1");
}

/**
 * The imported content uses standalone `---` lines as section dividers. When
 * such a line immediately follows a paragraph (no blank line between), Markdown
 * treats it as a **setext heading underline** — turning that paragraph into an
 * `<h2>`, so body text renders huge and bold (e.g. the "About The Test" intro).
 * These dividers are redundant with our own section layout, so strip standalone
 * thematic-break lines (`---`, `***`, `___`, `===`) entirely. This fixes the
 * oversized-paragraph bug without altering the actual prose. Markdown tables are
 * unaffected (they use `|---|`, never a bare `---`).
 */
function stripDividerLines(input: string): string {
  return input.replace(/^[ \t]*(-{3,}|\*{3,}|_{3,}|={3,})[ \t]*$/gm, "");
}

/**
 * Some imported blogs link to fully-qualified `https://cadabamsdiagnostics.com/...`
 * URLs. Rewrite those to in-site relative paths so navigation stays internal
 * (preserves SPA-style transitions and works in local dev / staging).
 */
function rewriteInternalLinks(input: string): string {
  return input.replace(
    /(\]\()https?:\/\/(?:www\.)?cadabamsdiagnostics\.com(\/[^\s)]*)?\)/gi,
    (_m, open, path) => `${open}${path || "/"})`,
  );
}

/**
 * Styled markdown renderer for blog/test/center detail pages.
 * Uses arbitrary selectors instead of @tailwindcss/typography to keep
 * the dependency surface small and the styling consistent with our tokens.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content) return null;
  return (
    <div
      className={cn(
        "text-body text-ink-600 leading-relaxed",
        "[&_h2]:text-h2 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-ink-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0",
        "[&_h3]:text-h3 [&_h3]:font-bold [&_h3]:text-ink-900 [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_h4]:text-body [&_h4]:font-bold [&_h4]:text-ink-900 [&_h4]:mt-4 [&_h4]:mb-2",
        "[&_p]:mb-4 [&_p:last-child]:mb-0",
        "[&_a]:text-orange-600 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-orange-300 hover:[&_a]:decoration-orange-600",
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-1.5",
        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-1.5",
        "[&_li]:leading-relaxed",
        "[&_strong]:text-ink-900 [&_strong]:font-bold",
        "[&_em]:italic",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-5 [&_table]:rounded-md [&_table]:overflow-hidden [&_table]:shadow-sh-1",
        "[&_th]:text-left [&_th]:font-semibold [&_th]:text-ink-900 [&_th]:bg-cream-soft [&_th]:px-3 [&_th]:py-2.5 [&_th]:border [&_th]:border-cream-line [&_th]:text-body-sm",
        "[&_td]:px-3 [&_td]:py-2.5 [&_td]:border [&_td]:border-cream-line [&_td]:text-body-sm",
        "[&_img]:rounded-md [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-50 [&_blockquote]:pl-4 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:my-4 [&_blockquote]:rounded-r-md [&_blockquote]:italic [&_blockquote]:text-ink-700",
        "[&_code:not(pre_code)]:bg-orange-50 [&_code:not(pre_code)]:text-orange-700 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:text-meta [&_code:not(pre_code)]:font-mono",
        "[&_pre]:bg-ink-900 [&_pre]:text-cream-bg [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-meta",
        "[&_hr]:border-cream-line [&_hr]:my-8",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {rewriteInternalLinks(stripDividerLines(unescapeMarkdown(content)))}
      </ReactMarkdown>
    </div>
  );
}
