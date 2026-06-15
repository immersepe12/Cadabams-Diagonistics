"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Numeric target, e.g. 4.9, 60, 10000. */
  value: number;
  /** Decimal places to show (default inferred from value). */
  decimals?: number;
  /** Text rendered before the number (e.g. "₹"). */
  prefix?: string;
  /** Text rendered after the number (e.g. "+", "M", "%"). */
  suffix?: string;
  /** Animation length in ms. */
  durationMs?: number;
  className?: string;
}

/**
 * Counts up to `value` the first time it scrolls into view (§6.4). Respects
 * prefers-reduced-motion by rendering the final value immediately. SSR-safe:
 * the server/first-client render shows the final value to avoid layout shift,
 * then the animation runs on the client once visible.
 */
export function CountUp({
  value,
  decimals,
  prefix = "",
  suffix = "",
  durationMs = 600,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);
  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // No animation under reduced-motion — state already holds the final value.
    if (reduce) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setDisplay(value * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      setDisplay(0);
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-IN", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })}
      {suffix}
    </span>
  );
}
