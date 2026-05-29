"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartItem {
  /** Stable id of the test/scan. */
  id: string;
  name: string;
  /** Per-unit price in INR (final/discounted price). */
  price: number;
  /** Original price before discount, if any. */
  originalPrice?: number;
  /** Detail-page href, e.g. /bangalore/lab-test/<slug>. */
  href: string;
  /** "Lab Test" | "Radiology" | etc. */
  kind?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

/**
 * Cart store backed by Zustand with the persist middleware, so items survive
 * reloads via localStorage (key: cadabams_cart_v1) and stay in sync across tabs.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity } : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cadabams_cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** Total number of units across all line items. */
export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

/** Sum of price * quantity across all line items. */
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.price * i.quantity, 0);

/**
 * Returns true once the persisted store has rehydrated on the client. Use this
 * to gate cart-dependent UI and avoid a hydration mismatch on first paint.
 */
export function useCartHydrated(): boolean {
  // Always start false so server and first client render agree (no mismatch),
  // then flip to true once the persisted store has rehydrated on the client.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const persist = useCartStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }
    if (persist.hasHydrated()) setHydrated(true);
    const unsub = persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}
