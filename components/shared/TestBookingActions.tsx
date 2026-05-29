"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Phone, ShoppingCart, X, Zap } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";

const PHONE_DISPLAY = "+91 99006 64696";
const PHONE_TEL = "+919900664696";
const WHATSAPP_NUMBER = "919538593355";

type Mode = "whatsapp" | "call";

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
  bookHref?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

export function TestBookingActions({
  testName,
  finalPrice,
  testId,
  testHref,
  originalPrice,
  kind,
  bookHref = "/cart",
}: TestBookingActionsProps) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const cartId = testId ?? testHref ?? testName;
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === cartId));
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAddToCart() {
    addItem({
      id: cartId,
      name: testName,
      price: finalPrice,
      originalPrice,
      href: testHref ?? "/cart",
      kind,
    });
    setJustAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const isOpen = mode !== null;

  useEffect(() => {
    if (!isOpen) return;
    firstFieldRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMode(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  function close() {
    setMode(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (mode === "whatsapp") {
      const lines = [
        `Hi Cadabam's Diagnostics, I'd like to book the ${testName} test.`,
        `Price: ₹${finalPrice.toLocaleString("en-IN")}`,
        trimmedName && `Name: ${trimmedName}`,
        trimmedPhone && `Phone: ${trimmedPhone}`,
        message.trim() && `Note: ${message.trim()}`,
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (mode === "call") {
      window.location.href = `tel:${PHONE_TEL}`;
    }

    setMode(null);
    setName("");
    setPhone("");
    setMessage("");
  }

  const isWhatsApp = mode === "whatsapp";
  const accent = isWhatsApp
    ? {
        ring: "focus:border-[#25D366] focus:ring-[#25D366]/20",
        button: "bg-[#25D366] hover:brightness-110 text-white",
        chip: "bg-[#25D366]/10 text-[#1a8a47]",
        title: `Chat about ${testName}`,
        cta: "Open WhatsApp",
        sub: "We'll pre-fill your details in the chat.",
      }
    : {
        ring: "focus:border-orange-500 focus:ring-orange-500/20",
        button: "bg-gradient-cta hover:brightness-110 text-white",
        chip: "bg-orange-100 text-orange-700",
        title: "Call to book this test",
        cta: "Call now",
        sub: "Your details help our team prepare in advance.",
      };

  return (
    <>
      <div className="space-y-2.5">
        <Link
          href={bookHref}
          className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-cta text-white font-bold px-7 py-3.5 text-body shadow-glow-orange ring-2 ring-orange-300/30 hover:brightness-110 hover:-translate-y-0.5 hover:ring-orange-400/50 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
        >
          <Zap className="w-4 h-4 fill-white" />
          Book now · ₹{finalPrice.toLocaleString("en-IN")}
        </Link>

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

        <button
          type="button"
          onClick={() => setMode("whatsapp")}
          aria-haspopup="dialog"
          className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-[#25D366] hover:brightness-110 text-white font-semibold px-7 py-3.5 text-body shadow-sh-2 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30"
        >
          <WhatsAppIcon className="w-5 h-5" />
          WhatsApp us
        </button>

        <button
          type="button"
          onClick={() => setMode("call")}
          aria-haspopup="dialog"
          className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-cream-soft hover:bg-cream-line text-ink-900 font-semibold px-7 py-3.5 text-body border border-cream-line transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
        >
          <Phone className="w-4 h-4 text-orange-600" />
          Call {PHONE_DISPLAY}
        </button>

        <p className="text-caption text-ink-400 text-center pt-1">
          Open Mon–Sat, 6:30 AM – 9:00 PM
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-dialog-title"
            className="relative w-full max-w-md bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-cream-line">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-10 h-10 inline-flex items-center justify-center rounded-pill flex-shrink-0 ${accent.chip}`}
                >
                  {isWhatsApp ? (
                    <WhatsAppIcon className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5 fill-current" />
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    id="booking-dialog-title"
                    className="text-body font-bold text-ink-900 leading-tight"
                  >
                    {accent.title}
                  </p>
                  <p className="text-caption text-ink-500 mt-0.5">
                    {accent.sub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="w-8 h-8 inline-flex items-center justify-center rounded-pill text-ink-500 hover:bg-cream-line hover:text-ink-900 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-meta font-semibold text-ink-700 mb-1"
                >
                  Your name
                </label>
                <input
                  ref={firstFieldRef}
                  id="booking-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Priya Sharma"
                  className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2.5 text-body-sm focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
                />
              </div>
              <div>
                <label
                  htmlFor="booking-phone"
                  className="block text-meta font-semibold text-ink-700 mb-1"
                >
                  Phone number
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputMode="tel"
                  pattern="[0-9+\s\-()]{7,}"
                  placeholder="+91 98765 43210"
                  className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2.5 text-body-sm focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
                />
              </div>
              {isWhatsApp && (
                <div>
                  <label
                    htmlFor="booking-message"
                    className="block text-meta font-semibold text-ink-700 mb-1"
                  >
                    Note{" "}
                    <span className="text-ink-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="booking-message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Preferred date, address, or any questions"
                    className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2.5 text-body-sm resize-none focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
                  />
                </div>
              )}
              <div className="rounded-md bg-cream-soft px-3 py-2.5 text-meta text-ink-600 border border-cream-line">
                <span className="font-semibold text-ink-900">{testName}</span>
                <span className="text-ink-400"> · </span>
                <span className="font-bold text-orange-600">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="submit"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-pill font-semibold px-5 py-3 text-body shadow-sh-2 active:scale-[0.98] transition-all duration-200 ${accent.button}`}
              >
                {isWhatsApp ? (
                  <WhatsAppIcon className="w-5 h-5" />
                ) : (
                  <Phone className="w-4 h-4 fill-current" />
                )}
                {accent.cta}
              </button>
              <p className="text-caption text-ink-400 text-center pt-1">
                By continuing, you agree to be contacted by our team.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
