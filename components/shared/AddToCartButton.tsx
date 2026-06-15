"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  className?: string;
  /** Label shown in the default (not-added) state. */
  label?: string;
  /**
   * Icon-only rendering — shows just the cart/check icon (no text). The
   * accessible name still comes from `aria-label`. Used on compact cards where
   * "Book now" is the single primary action.
   */
  iconOnly?: boolean;
}

export function AddToCartButton({
  item,
  className,
  label = "Add to cart",
  iconOnly = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === item.id));
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleClick() {
    // Once the item is in the cart, the button becomes a shortcut to /cart.
    if (inCart) {
      router.push("/cart");
      return;
    }
    addItem(item);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={inCart ? "Go to cart" : `Add ${item.name} to cart`}
      className={cn(className, (justAdded || inCart) && "is-added")}
    >
      {justAdded ? (
        <>
          <Check className="w-4 h-4" />
          {!iconOnly && "Added"}
        </>
      ) : inCart ? (
        <>
          <ShoppingCart className="w-4 h-4" />
          {!iconOnly && "Go to cart"}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {!iconOnly && label}
        </>
      )}
    </button>
  );
}
