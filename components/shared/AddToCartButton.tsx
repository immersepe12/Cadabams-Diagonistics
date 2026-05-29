"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  className?: string;
  /** Label shown in the default (not-added) state. */
  label?: string;
}

export function AddToCartButton({
  item,
  className,
  label = "Add to cart",
}: AddToCartButtonProps) {
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
    addItem(item);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${item.name} to cart`}
      className={cn(className, (justAdded || inCart) && "is-added")}
    >
      {justAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {inCart ? "Added to cart" : label}
        </>
      )}
    </button>
  );
}
