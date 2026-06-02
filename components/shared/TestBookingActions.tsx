"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";

interface TestBookingActionsProps {
  testName: string;
  finalPrice: number;
  /** Stable id used as the cart key. Falls back to bookHref/testName. */
  testId?: string;
  /** Detail-page href stored with the cart item. */
  testHref?: string;
  /** Original (struck) price, if discounted. */
  originalPrice?: number;
  /** "Lab Test" | "Radiology". */
  kind?: string;
}

export function TestBookingActions({
  testName,
  finalPrice,
  testId,
  testHref,
  originalPrice,
  kind,
}: TestBookingActionsProps) {
  const router = useRouter();
  const cartId = testId ?? testHref ?? testName;
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === cartId));
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartItem = {
    id: cartId,
    name: testName,
    price: finalPrice,
    originalPrice,
    href: testHref ?? "/cart",
    kind,
  };

  function handleAddToCart() {
    addItem(cartItem);
    setJustAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  function handleBookNow() {
    addItem(cartItem);
    router.push("/cart");
  }

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={handleBookNow}
        className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-7 py-3.5 text-body shadow-glow-orange ring-2 ring-orange-300/30 hover:brightness-110 hover:-translate-y-0.5 hover:ring-orange-400/50 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
      >
        <Zap className="w-4 h-4 fill-white" />
        Book now · ₹{finalPrice.toLocaleString("en-IN")}
      </button>

      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-7 py-3.5 text-body border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
      >
        {justAdded ? (
          <>
            <Check className="w-4 h-4" />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "Added to cart" : "Add to cart"}
          </>
        )}
      </button>

      <p className="text-caption text-ink-400 text-center pt-1">
        Open Mon–Sat, 6:30 AM – 9:00 PM
      </p>
    </div>
  );
}
