
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The design system defines custom font-size tokens (text-h1, text-body-sm,
// text-caption, …). tailwind-merge doesn't know these are font sizes, so by
// default it treats e.g. `text-body-sm` as a *text color* and will drop a real
// color like `text-white` when both appear in the same cn() call. Registering
// the tokens in the `font-size` group keeps colors and sizes independent.
const FONT_SIZE_TOKENS = [
  "display-1",
  "display-2",
  "h1",
  "h2",
  "h3",
  "body",
  "body-sm",
  "meta",
  "caption",
  "overline",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZE_TOKENS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
