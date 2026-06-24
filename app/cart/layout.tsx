import type { Metadata } from "next";

// The cart page itself is a client component, so its metadata (title +
// self-referencing canonical) lives here in a server-component layout.
export const metadata: Metadata = {
  title: "Your Cart",
  alternates: { canonical: "https://cadabamsdiagnostics.com/cart" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
