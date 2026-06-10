"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Phone,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Clock,
  HeartPulse,
} from "lucide-react";
import { CTAButton } from "@/components/shared/CTAButton";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import {
  useCartStore,
  useCartHydrated,
  selectSubtotal,
  type CartItem,
} from "@/lib/cart/store";
import cartContent from "@/data/allpages/cart/page.json";

const TRUST_ICONS = { Clock, HeartPulse, ShieldCheck } as const;

export default function CartPage() {
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(selectSubtotal);

  // Item pending removal confirmation (set when decrementing the last unit).
  const [pendingRemove, setPendingRemove] = useState<CartItem | null>(null);

  function decrement(item: CartItem) {
    if (item.quantity <= 1) {
      setPendingRemove(item);
    } else {
      setQuantity(item.id, item.quantity - 1);
    }
  }

  function confirmRemove() {
    if (pendingRemove) removeItem(pendingRemove.id);
    setPendingRemove(null);
  }

  // Close the confirmation dialog on Escape.
  useEffect(() => {
    if (!pendingRemove) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPendingRemove(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingRemove]);

  function bookOnWhatsApp() {
    const lines = [
      "Hi Cadabam's Diagnostics, I'd like to book the following:",
      ...items.map(
        (i) =>
          `• ${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""} — ₹${(
            i.price * i.quantity
          ).toLocaleString("en-IN")}`,
      ),
      `Total: ₹${subtotal.toLocaleString("en-IN")}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(
      `https://wa.me/${cartContent.whatsappNumber}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // Avoid a hydration flash: render nothing meaningful until the store is read.
  if (!hydrated) {
    return (
      <main className="bg-cream-bg min-h-screen">
        <section className="mx-auto max-w-5xl px-gutter py-10 lg:py-14">
          <div className="h-8 w-40 bg-cream-line rounded-pill animate-pulse" />
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="mx-auto max-w-6xl px-gutter py-8 lg:py-10">
        <div className="mb-5 lg:mb-6">
          <h1 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight">
            {cartContent.title}
          </h1>
          <p className="text-body-sm text-ink-500 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} ready to book
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_360px] items-start">
          {/* Items */}
          <ul className="space-y-3 lg:space-y-4">
            {items.map((item) => {
              const showStrike =
                typeof item.originalPrice === "number" &&
                item.originalPrice > item.price;
              return (
                <li
                  key={item.id}
                  className="bg-cream-card rounded-2xl border border-cream-line shadow-sh-1 p-4 sm:p-5 flex gap-4"
                >
                  <div className="min-w-0 flex-1">
                    {item.kind && (
                      <span className="inline-flex items-center rounded-pill bg-orange-50 text-orange-700 border border-orange-100 text-caption font-bold uppercase tracking-overline px-2 py-0.5 mb-1.5">
                        {item.kind}
                      </span>
                    )}
                    <h3 className="text-body sm:text-h3 font-bold text-ink-900 leading-snug">
                      <Link
                        href={item.href || "/cart"}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-h3 font-extrabold text-orange-600 leading-none">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      {showStrike && (
                        <span className="text-caption text-ink-400 line-through">
                          ₹
                          {(item.originalPrice! * item.quantity).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <span className="text-caption text-ink-500">
                          (₹{item.price.toLocaleString("en-IN")} each)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center gap-3 flex-shrink-0">
                    <div className="inline-flex items-center rounded-pill border border-cream-line bg-cream-bg">
                      <button
                        type="button"
                        onClick={() => decrement(item)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-pill text-ink-700 hover:text-orange-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-body-sm font-bold text-ink-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-pill text-ink-700 hover:text-orange-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden">
              <div className="bg-gradient-orange-soft p-5 border-b border-cream-line">
                <p className="text-overline uppercase text-orange-700 font-bold tracking-overline">
                  {cartContent.summary.title}
                </p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-body-sm text-ink-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm text-ink-700">
                  <span>Home collection</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
                <div className="border-t border-cream-line pt-3 flex items-center justify-between">
                  <span className="text-body font-bold text-ink-900">
                    Total
                  </span>
                  <span className="text-h2 font-extrabold text-orange-600">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={bookOnWhatsApp}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-7 py-3.5 text-body shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                >
                  {cartContent.summary.proceedLabel}
                </button>

                <ul className="pt-3 space-y-2 text-meta text-ink-600">
                  {cartContent.summary.trust.map((t) => {
                    const Icon =
                      TRUST_ICONS[t.icon as keyof typeof TRUST_ICONS] ?? Clock;
                    return (
                      <li key={t.text} className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                        {t.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <ContactActionButton
              mode="call"
              phone={cartContent.helpPhone}
              context="Cart — booking help"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-pill bg-cream-card hover:bg-cream-soft text-ink-900 font-semibold px-5 py-3 text-body-sm border border-cream-line transition-all"
            >
              <Phone className="w-4 h-4 text-orange-600" />
              Need help? Call us
            </ContactActionButton>
          </aside>
        </div>
      </section>

      {pendingRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            aria-hidden
            onClick={() => setPendingRemove(null)}
            className="absolute inset-0 bg-ink-900/55 backdrop-blur-[2px] animate-in fade-in duration-150"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-title"
            aria-describedby="remove-desc"
            className="relative w-full max-w-sm bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-6 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-pill bg-coral-400/10 text-coral-400 inline-flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2
              id="remove-title"
              className="mt-4 text-h3 font-bold text-ink-900"
            >
              Remove this item?
            </h2>
            <p id="remove-desc" className="mt-2 text-body-sm text-ink-600">
              <span className="font-semibold text-ink-900">
                {pendingRemove.name}
              </span>{" "}
              will be removed from your cart.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingRemove(null)}
                className="flex-1 inline-flex items-center justify-center rounded-pill border border-cream-line bg-cream-card text-ink-900 font-semibold px-4 py-2.5 text-body-sm hover:bg-cream-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-pill bg-coral-400 text-white font-semibold px-4 py-2.5 text-body-sm hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyCart() {
  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="mx-auto max-w-3xl px-gutter py-10 lg:py-14 text-center">
        <div className="w-20 h-20 mx-auto rounded-pill bg-orange-50 inline-flex items-center justify-center mb-6">
          <ShoppingCart className="w-9 h-9 text-orange-600" />
        </div>
        <h1 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900">
          {cartContent.empty.title}
        </h1>
        <p className="mt-3 text-body lg:text-h3 text-ink-600 max-w-xl mx-auto leading-relaxed">
          {cartContent.empty.description}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {cartContent.empty.buttons.map((b, i) => (
            <CTAButton
              key={b.href}
              href={b.href}
              variant={i === 0 ? "primary" : "secondary"}
              size="lg"
            >
              {b.label}
            </CTAButton>
          ))}
        </div>

        <div className="mt-10 bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-5 max-w-md mx-auto">
          <p className="text-body-sm text-ink-700">
            {cartContent.empty.helpText}
          </p>
          <ContactActionButton
            mode="call"
            phone={cartContent.helpPhone}
            className="mt-2 inline-flex items-center justify-center gap-2 text-h3 font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            {cartContent.helpPhone}
          </ContactActionButton>
        </div>
      </section>
    </main>
  );
}
