"use client";

import { useRouter } from "next/navigation";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

interface BookNowButtonProps {
  item: Omit<CartItem, "quantity">;
  className?: string;
  children: React.ReactNode;
}

/**
 * "Book now" CTA: adds the test/scan to the cart, then sends the user straight
 * to /cart. Used everywhere an item-specific Book-now button appears so the
 * behaviour stays consistent across the site.
 */
export function BookNowButton({ item, className, children }: BookNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  function handleClick() {
    addItem(item);
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Book ${item.name}`}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
