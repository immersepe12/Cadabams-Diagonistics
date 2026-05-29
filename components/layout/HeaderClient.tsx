"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import { useCartStore, useCartHydrated, selectCount } from "@/lib/cart/store";

interface NavItem {
  name: string;
  slug: string;
}

interface HeaderClientProps {
  logo: string;
  centers: NavItem[];
  radiologyCategories: NavItem[];
}

export function HeaderClient({
  logo,
  centers,
  radiologyCategories,
}: HeaderClientProps) {
  const pathname = usePathname();
  const cartHydrated = useCartHydrated();
  const cartCount = useCartStore(selectCount);
  const showCartCount = cartHydrated && cartCount > 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [radioOpen, setRadioOpen] = useState(false);
  const [centerOpen, setCenterOpen] = useState(false);
  const radioRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setRadioOpen(false);
    setCenterOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (radioRef.current && !radioRef.current.contains(t)) setRadioOpen(false);
      if (centerRef.current && !centerRef.current.contains(t))
        setCenterOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navLinkClass =
    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-body-sm text-ink-700 font-medium hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500";

  const dropdownButtonClass = (open: boolean) =>
    cn(navLinkClass, open && "text-orange-600 bg-orange-50");

  const dropdownPanelClass =
    "absolute left-0 top-full mt-2 min-w-[220px] bg-cream-card rounded-lg shadow-sh-3 border border-cream-line py-2 z-50";

  const dropdownItemClass =
    "block px-4 py-2.5 text-body-sm text-ink-700 hover:bg-orange-50 hover:text-orange-600 border-l-2 border-transparent hover:border-orange-500 transition-colors duration-150";

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-card border-b border-cream-line shadow-sh-1">
        <div className="mx-auto max-w-7xl px-gutter">
          <div className="h-18 flex items-center gap-4 lg:gap-6 py-3">
            <Link
              href="/"
              aria-label="Cadabams Diagnostics home"
              className="flex items-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
            >
              <Image
                src={logo}
                alt="Cadabams Diagnostics"
                width={120}
                height={48}
                priority
                className="h-10 w-auto"
              />
            </Link>

            <form
              action="/search"
              method="get"
              className="hidden lg:block flex-1 max-w-lg relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
              <input
                type="search"
                name="q"
                placeholder="Search tests or scans..."
                className="w-full bg-cream-soft text-ink-900 rounded-md pl-10 pr-4 py-2.5 text-body-sm border border-transparent focus:border-orange-500 focus:bg-cream-card focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200 placeholder:text-ink-400"
              />
            </form>

            <nav
              className="hidden lg:flex items-center gap-1 ml-auto flex-shrink-0"
              aria-label="Primary"
            >
              <Link
                href="/bangalore/lab-test"
                className={cn(
                  navLinkClass,
                  isActive("/bangalore/lab-test") &&
                    "text-orange-600 bg-orange-50",
                )}
              >
                <FlaskConical className="w-4 h-4" />
                <span>Lab Tests</span>
              </Link>

              <div ref={radioRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setRadioOpen((v) => !v);
                    setCenterOpen(false);
                  }}
                  aria-expanded={radioOpen}
                  aria-haspopup="true"
                  className={dropdownButtonClass(radioOpen)}
                >
                  <Activity className="w-4 h-4" />
                  <span>Radiology</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      radioOpen && "rotate-180",
                    )}
                  />
                </button>
                {radioOpen && (
                  <div className={dropdownPanelClass} role="menu">
                    {radiologyCategories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/bangalore/${c.slug}`}
                        className={dropdownItemClass}
                        role="menuitem"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div ref={centerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCenterOpen((v) => !v);
                    setRadioOpen(false);
                  }}
                  aria-expanded={centerOpen}
                  aria-haspopup="true"
                  className={dropdownButtonClass(centerOpen)}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Centers</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      centerOpen && "rotate-180",
                    )}
                  />
                </button>
                {centerOpen && (
                  <div className={dropdownPanelClass} role="menu">
                    {centers.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/bangalore/center/${c.slug}`}
                        className={dropdownItemClass}
                        role="menuitem"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/blogs"
                className={cn(
                  navLinkClass,
                  isActive("/blogs") && "text-orange-600 bg-orange-50",
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span>Blogs</span>
              </Link>

              <Link
                href="/cart"
                className={cn(
                  navLinkClass,
                  "relative",
                  isActive("/cart") && "text-orange-600 bg-orange-50",
                )}
              >
                <span className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {showCartCount && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 inline-flex items-center justify-center rounded-pill bg-orange-500 text-white text-[10px] font-bold leading-none">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <span>Cart</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center px-5 py-2 rounded-pill bg-orange-500 text-white text-body-sm font-semibold shadow-glow-orange hover:bg-orange-600 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Login
              </Link>
            </nav>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-drawer"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden ml-auto inline-flex items-center justify-center w-10 h-10 rounded-md text-ink-900 hover:bg-cream-soft transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <form
            action="/search"
            method="get"
            className="lg:hidden pb-3 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
            <input
              type="search"
              name="q"
              placeholder="Search tests or scans..."
              className="w-full bg-cream-soft text-ink-900 rounded-md pl-10 pr-4 py-2.5 text-body-sm border border-transparent focus:border-orange-500 focus:bg-cream-card focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200 placeholder:text-ink-400"
            />
          </form>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close menu"
        tabIndex={mobileOpen ? 0 : -1}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-ink-900/55 backdrop-blur-[2px] transition-opacity duration-300",
          mobileOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        id="mobile-menu-drawer"
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        className={cn(
          "lg:hidden fixed top-0 right-0 bottom-0 w-[min(22rem,88vw)] bg-cream-bg z-50 shadow-sh-3 flex flex-col transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-cream-line bg-cream-card flex-shrink-0">
          <Link
            href="/"
            aria-label="Cadabams Diagnostics home"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src={logo}
              alt="Cadabams Diagnostics"
              width={120}
              height={48}
              className="h-9 w-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-pill text-ink-700 hover:bg-cream-soft hover:text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          aria-label="Mobile"
        >
          <MobileLink
            href="/bangalore/lab-test"
            icon={<FlaskConical className="w-5 h-5" />}
            label="Lab Tests"
            active={isActive("/bangalore/lab-test")}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileGroup
            label="Radiology"
            icon={<Activity className="w-5 h-5" />}
            items={radiologyCategories.map((c) => ({
              name: c.name,
              href: `/bangalore/${c.slug}`,
            }))}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileGroup
            label="Centers"
            icon={<Building2 className="w-5 h-5" />}
            items={centers.map((c) => ({
              name: c.name,
              href: `/bangalore/center/${c.slug}`,
            }))}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileLink
            href="/blogs"
            icon={<BookOpen className="w-5 h-5" />}
            label="Blogs"
            active={isActive("/blogs")}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileLink
            href="/cart"
            icon={<ShoppingCart className="w-5 h-5" />}
            label={showCartCount ? `Cart (${cartCount})` : "Cart"}
            active={isActive("/cart")}
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>

        <div
          className="px-4 py-4 border-t border-cream-line bg-cream-card flex-shrink-0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-pill bg-gradient-cta text-white font-semibold shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setMobileOpen(false)}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-3 rounded-pill bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold border-2 border-orange-200 hover:border-orange-300 active:scale-[0.98] transition-all duration-200"
          >
            Create account
          </Link>
          <p className="mt-3 text-caption text-ink-500 text-center">
            Need help? Call{" "}
            <ContactActionButton
              mode="call"
              phone="+919900664696"
              className="text-orange-600 font-semibold underline-offset-2 hover:underline"
            >
              +91 99006 64696
            </ContactActionButton>
          </p>
        </div>
      </aside>
    </>
  );
}

function MobileLink({
  href,
  icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-lg text-body font-semibold transition-colors duration-150",
        active
          ? "bg-orange-50 text-orange-700"
          : "text-ink-900 hover:bg-cream-card",
      )}
    >
      <span
        className={cn(
          "w-9 h-9 inline-flex items-center justify-center rounded-pill flex-shrink-0",
          active
            ? "bg-orange-500 text-white"
            : "bg-orange-50 text-orange-600",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-ink-400" />
    </Link>
  );
}

function MobileGroup({
  label,
  icon,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  icon: React.ReactNode;
  items: { name: string; href: string }[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const groupActive = items.some(
    (it) => pathname === it.href || pathname.startsWith(it.href + "/"),
  );
  const [open, setOpen] = useState(groupActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body font-semibold transition-colors duration-150",
          groupActive
            ? "bg-orange-50 text-orange-700"
            : "text-ink-900 hover:bg-cream-card",
        )}
      >
        <span
          className={cn(
            "w-9 h-9 inline-flex items-center justify-center rounded-pill flex-shrink-0",
            groupActive
              ? "bg-orange-500 text-white"
              : "bg-orange-50 text-orange-600",
          )}
        >
          {icon}
        </span>
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 text-ink-500",
            open && "rotate-180 text-orange-600",
          )}
        />
      </button>
      {open && (
        <ul className="mt-1 mb-2 ml-12 border-l-2 border-cream-line space-y-0.5">
          {items.map((it) => {
            const itemActive =
              pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={onNavigate}
                  aria-current={itemActive ? "page" : undefined}
                  className={cn(
                    "block pl-4 pr-3 py-2 -ml-[2px] border-l-2 text-body-sm transition-colors duration-150",
                    itemActive
                      ? "border-orange-500 text-orange-700 font-semibold bg-orange-50/70 rounded-r-md"
                      : "border-transparent text-ink-700 hover:text-orange-600 hover:border-orange-300",
                  )}
                >
                  {it.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
