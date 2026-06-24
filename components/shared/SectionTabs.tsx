"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

/**
 * Sticky in-page Table of Contents.
 *
 * Renders a horizontal pill bar that links to the page's content sections,
 * highlights the section currently in view (scroll-spy), and smooth-scrolls to
 * a section on click. It sits directly beneath the sticky site header.
 *
 * The matching sections must exist in the DOM with `id`s equal to each item's
 * `id`, and should carry a `scroll-mt-*` utility so they don't hide under the
 * sticky header + this bar when navigated to.
 */

// Distance from the top of the viewport (px) at which a section is considered
// "current". Clears the sticky header (~56px) + this bar (~52px) with a buffer.
const ACTIVATION_OFFSET = 132;

export function SectionTabs({ sections }: { sections: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll-spy: the active section is the last one whose top has scrolled above
  // the activation line. Sections are in document order, so a single pass works.
  useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;
    const compute = () => {
      frame = 0;
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - ACTIVATION_OFFSET <= 0) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  // Keep the active pill within view inside the horizontally-scrolling bar.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const pill = list.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    if (!pill) return;
    const listRect = list.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const delta =
      pillRect.left - listRect.left - (list.clientWidth - pillRect.width) / 2;
    list.scrollTo({ left: list.scrollLeft + delta, behavior: "smooth" });
  }, [activeId]);

  if (sections.length < 2) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    // Always handle the scroll ourselves so the URL hash never changes.
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 z-30 mt-6 border-y border-cream-line bg-cream-bg/90 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-gutter">
        <ul
          ref={listRef}
          className="scrollbar-hidden flex items-center gap-1.5 overflow-x-auto py-2.5 text-body-sm font-semibold"
        >
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-toc-id={section.id}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => handleClick(event, section.id)}
                  className={cn(
                    "inline-flex items-center rounded-pill px-4 py-2 whitespace-nowrap transition-colors duration-200",
                    isActive
                      ? "bg-gradient-cta text-white shadow-sh-1"
                      : "text-ink-600 hover:bg-orange-50 hover:text-orange-700",
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
