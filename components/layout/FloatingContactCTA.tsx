"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";

const PHONE_NUMBER = "+919900664696";
const WHATSAPP_NUMBER = "919538593355";

type Mode = "whatsapp" | "call";

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

export function FloatingContactCTA() {
  // `expanded` = the contact menu (WhatsApp + Call) is open.
  const [expanded, setExpanded] = useState(false);
  // `mode` = a lead-capture form for the chosen channel is open.
  const [mode, setMode] = useState<Mode | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Hide the FAB on the cart/checkout flow where it only adds clutter.
  const hidden = pathname?.startsWith("/cart") ?? false;

  const isOpen = mode !== null;

  // Focus + dismiss handling for the lead-capture form.
  useEffect(() => {
    if (!isOpen) return;
    firstFieldRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMode(null);
    }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMode(null);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isOpen]);

  // Dismiss the expanded contact menu on Escape / outside click.
  useEffect(() => {
    if (!expanded) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    function onClick(e: MouseEvent) {
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [expanded]);

  function openMode(next: Mode) {
    setExpanded(false);
    setMode(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (mode === "whatsapp") {
      const lines = [
        `Hi Cadabam's Diagnostics, I'd like to book a test.`,
        trimmedName && `Name: ${trimmedName}`,
        trimmedPhone && `Phone: ${trimmedPhone}`,
        message.trim() && `Message: ${message.trim()}`,
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (mode === "call") {
      window.location.href = `tel:${PHONE_NUMBER}`;
    }

    setMode(null);
    setName("");
    setPhone("");
    setMessage("");
  }

  if (hidden) return null;

  const isWhatsApp = mode === "whatsapp";
  const accent = isWhatsApp
    ? {
        ring: "focus:border-[#25D366] focus:ring-[#25D366]/20",
        button: "bg-[#25D366] hover:brightness-110 text-white",
        chip: "bg-[#25D366]/10 text-[#1a8a47]",
        title: "Chat on WhatsApp",
        cta: "Start chat",
        sub: "We'll open WhatsApp with your message pre-filled.",
      }
    : {
        ring: "focus:border-orange-500 focus:ring-orange-500/20",
        button: "bg-gradient-cta hover:brightness-110 text-white",
        chip: "bg-orange-100 text-orange-700",
        title: "Call Cadabam's Diagnostics",
        cta: "Call now",
        sub: "Tap below to dial — your details help us serve you faster.",
      };

  return (
    <div
      ref={stackRef}
      className="fixed z-50 right-3 sm:right-6 bottom-3 sm:bottom-6 flex flex-col items-end gap-2 sm:gap-3"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-cta-title"
          className="w-[min(22rem,calc(100vw-2rem))] bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-cream-line">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-9 h-9 inline-flex items-center justify-center rounded-pill flex-shrink-0 ${accent.chip}`}
              >
                {isWhatsApp ? (
                  <WhatsAppIcon className="w-5 h-5" />
                ) : (
                  <Phone className="w-4.5 h-4.5 fill-current" />
                )}
              </span>
              <div className="min-w-0">
                <p
                  id="floating-cta-title"
                  className="text-body font-bold text-ink-900 leading-tight truncate"
                >
                  {accent.title}
                </p>
                <p className="text-caption text-ink-500 truncate">
                  {accent.sub}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMode(null)}
              aria-label="Close"
              className="w-8 h-8 inline-flex items-center justify-center rounded-pill text-ink-500 hover:bg-cream-line hover:text-ink-900 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            <div>
              <label
                htmlFor="fcta-name"
                className="block text-meta font-semibold text-ink-700 mb-1"
              >
                Your name
              </label>
              <input
                ref={firstFieldRef}
                id="fcta-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Priya Sharma"
                className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2 text-body-sm focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
              />
            </div>
            <div>
              <label
                htmlFor="fcta-phone"
                className="block text-meta font-semibold text-ink-700 mb-1"
              >
                Phone number
              </label>
              <input
                id="fcta-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="tel"
                pattern="[0-9+\s\-()]{7,}"
                placeholder="+91 98765 43210"
                className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2 text-body-sm focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
              />
            </div>
            {isWhatsApp && (
              <div>
                <label
                  htmlFor="fcta-message"
                  className="block text-meta font-semibold text-ink-700 mb-1"
                >
                  Message{" "}
                  <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="fcta-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Which test or scan are you interested in?"
                  className={`w-full bg-cream-bg rounded-md border border-cream-line text-ink-900 placeholder:text-ink-400 px-3 py-2 text-body-sm resize-none focus:outline-none focus:ring-4 transition-all ${accent.ring}`}
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-pill font-semibold px-5 py-2.5 text-body shadow-sh-2 active:scale-[0.98] transition-all duration-200 ${accent.button}`}
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
      )}

      {/* Expanded contact actions: WhatsApp + Call. Hidden while the form is open. */}
      {expanded && !isOpen && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <button
            type="button"
            onClick={() => openMode("whatsapp")}
            className="group inline-flex items-center gap-2.5 rounded-pill bg-cream-card shadow-sh-3 border border-cream-line pl-4 pr-2 py-1.5 hover:bg-cream-soft active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-700"
          >
            <span className="text-body-sm font-semibold text-ink-900">
              WhatsApp
            </span>
            <span className="w-9 h-9 inline-flex items-center justify-center rounded-pill bg-[#25D366] text-white flex-shrink-0">
              <WhatsAppIcon className="w-5 h-5" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => openMode("call")}
            className="group inline-flex items-center gap-2.5 rounded-pill bg-cream-card shadow-sh-3 border border-cream-line pl-4 pr-2 py-1.5 hover:bg-cream-soft active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-700"
          >
            <span className="text-body-sm font-semibold text-ink-900">Call</span>
            <span className="w-9 h-9 inline-flex items-center justify-center rounded-pill bg-deep-700 text-white flex-shrink-0">
              <Phone className="w-4.5 h-4.5 fill-current" />
            </span>
          </button>
        </div>
      )}

      {/* Single unified contact FAB. */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Close contact options" : "Contact us"}
          aria-expanded={expanded}
          className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-pill bg-deep-700 text-white shadow-sh-3 ring-2 ring-white hover:bg-deep-800 active:scale-95 transition-[background-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-700 focus-visible:ring-offset-2"
        >
          {expanded ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          )}
        </button>
      )}
    </div>
  );
}
