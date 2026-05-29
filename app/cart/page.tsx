"use client";

import Link from "next/link";
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
} from "@/lib/cart/store";

export default function CartPage() {
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectSubtotal);

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
      `https://wa.me/919538593355?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // Avoid a hydration flash: render nothing meaningful until the store is read.
  if (!hydrated) {
    return (
      <main className="bg-cream-bg min-h-screen">
        <section className="mx-auto max-w-5xl px-gutter py-16 lg:py-24">
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
      <section className="mx-auto max-w-6xl px-gutter py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6 lg:mb-8">
          <div>
            <h1 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900 tracking-tight">
              Your cart
            </h1>
            <p className="text-body-sm text-ink-500 mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} ready to
              book
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-meta font-semibold text-ink-500 hover:text-orange-700 underline underline-offset-2 transition-colors"
          >
            Clear cart
          </button>
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

                  <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-pill text-ink-400 hover:text-coral-400 hover:bg-cream-soft transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="inline-flex items-center rounded-pill border border-cream-line bg-cream-bg">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.id, item.quantity - 1)
                        }
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
                  Order summary
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
                  Proceed to book
                </button>

                <ul className="pt-3 space-y-2 text-meta text-ink-600">
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    Reports in 6 hours on most tests
                  </li>
                  <li className="flex items-center gap-2">
                    <HeartPulse className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    Free home sample collection
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    NABL Accredited labs
                  </li>
                </ul>
              </div>
            </div>

            <ContactActionButton
              mode="call"
              phone="+91 99006 64696"
              context="Cart — booking help"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-pill bg-cream-card hover:bg-cream-soft text-ink-900 font-semibold px-5 py-3 text-body-sm border border-cream-line transition-all"
            >
              <Phone className="w-4 h-4 text-orange-600" />
              Need help? Call us
            </ContactActionButton>
          </aside>
        </div>
      </section>
    </main>
  );
}

function EmptyCart() {
  return (
    <main className="bg-cream-bg min-h-screen">
      <section className="mx-auto max-w-3xl px-gutter py-16 lg:py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-pill bg-orange-50 inline-flex items-center justify-center mb-6">
          <ShoppingCart className="w-9 h-9 text-orange-600" />
        </div>
        <h1 className="text-h1 sm:text-display-2 font-display font-extrabold text-ink-900">
          Your cart is empty
        </h1>
        <p className="mt-3 text-body lg:text-h3 text-ink-600 max-w-xl mx-auto leading-relaxed">
          Browse our lab tests or radiology scans to add a test to your cart,
          or call us directly and we&apos;ll book it for you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <CTAButton href="/bangalore/lab-test" variant="primary" size="lg">
            Browse lab tests
          </CTAButton>
          <CTAButton href="/bangalore/xray-scan" variant="secondary" size="lg">
            Browse radiology
          </CTAButton>
        </div>

        <div className="mt-10 bg-cream-card rounded-2xl shadow-sh-2 border border-cream-line p-5 max-w-md mx-auto">
          <p className="text-body-sm text-ink-700">Prefer to talk to a person?</p>
          <ContactActionButton
            mode="call"
            phone="+919900664696"
            className="mt-2 inline-flex items-center justify-center gap-2 text-h3 font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            +91 99006 64696
          </ContactActionButton>
        </div>
      </section>
    </main>
  );
}
