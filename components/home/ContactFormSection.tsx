"use client";

import { useState, FormEvent } from "react";
import { Check, Phone, Mail, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactActionButton } from "@/components/shared/ContactActionButton";
import { CentersListCard } from "@/components/shared/CentersListCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface VisitCenter {
  /** Short, human-friendly name e.g. "Banashankari". */
  name: string;
  address: string;
  /** Internal centre page, e.g. /bangalore/center/banashankari. */
  href: string;
  /** External Google Maps directions link. */
  mapUrl?: string;
}

interface ContactFormSectionProps {
  logo: string;
  phone?: string;
  email?: string;
  address?: string;
  /** All diagnostics centres, shown in the "Visit us" block. */
  centers?: VisitCenter[];
}

type Status = "idle" | "submitting" | "submitted" | "error";

const FRESHSALES_ENDPOINT =
  "https://cadabamsdiagnostics.myfreshworks.com/crm/sales/smart_form/create_entity?file_attachments_present=false";
const FRESHSALES_KEY =
  "bb88c16791f1cb14ef2689824060cde9861d5bfdd5e32975167f8cdb57f7b0b6";

export function ContactFormSection({
  phone,
  email,
  centers = [],
}: ContactFormSectionProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    address: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("file_attachments_present", "false");
      body.append("contact[first_name]", form.firstName);
      body.append("contact[last_name]", form.lastName);
      body.append("contact[mobile_number]", form.mobile);
      body.append("contact[email]", form.email);
      body.append("contact[address]", form.address);
      body.append("contact[message]", form.message);
      body.append("entity_type", "2");
      body.append("asset_key", FRESHSALES_KEY);

      const res = await fetch(FRESHSALES_ENDPOINT, { method: "POST", body });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus("submitted");
      setForm({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        address: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  const bind = (name: keyof typeof form) => ({
    id: name,
    name,
    value: form[name],
    className: "bg-white shadow-none focus-visible:bg-white",
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  const contactRows = [
    phone && {
      icon: Phone,
      node: (
        <ContactActionButton
          mode="call"
          phone={phone}
          className="text-left text-ink-900 hover:text-orange-600 transition-colors font-medium"
        >
          {phone}
        </ContactActionButton>
      ),
    },
    email && {
      icon: Mail,
      node: (
        <a
          href={`mailto:${email}`}
          className="text-ink-900 hover:text-orange-600 transition-colors font-medium break-all"
        >
          {email}
        </a>
      ),
    },
  ].filter(Boolean) as { icon: typeof Phone; node: React.ReactNode }[];

  const disabled = status === "submitting" || status === "submitted";

  return (
    <section id="contact" className="reveal-up py-8 lg:py-12 bg-cream-bg scroll-mt-20">
      <div className="mx-auto max-w-7xl px-gutter grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Intro + contact details */}
        <div className="space-y-5 lg:order-2 lg:pt-2">
          <p className="text-overline uppercase text-orange-600 font-bold tracking-wide">
            Talk to us
          </p>
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display leading-tight">
            Have questions? We&apos;re here to help.
          </h2>
          <p className="text-body text-ink-600 leading-relaxed max-w-md">
            Share a few details and our team will reach out — book a test,
            schedule a scan, or ask about home sample collection across
            Bangalore.
          </p>

          {contactRows.length > 0 && (
            <ul className="space-y-3 pt-2">
              {contactRows.map(({ icon: Icon, node }, i) => (
                <li key={i} className="flex items-center gap-3 text-body-sm">
                  <span className="w-9 h-9 rounded-pill bg-orange-50 text-orange-600 inline-flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  {node}
                </li>
              ))}
            </ul>
          )}

          {/* Visit us — centre list (name + chevron) */}
          {centers.length > 0 && (
            <CentersListCard
              heading="Visit us"
              centers={centers.map((c) => ({
                name: c.name,
                slug: c.href.split("/").filter(Boolean).pop() ?? c.href,
              }))}
            />
          )}
        </div>

        {/* Form card */}
        <Card className="lg:order-1 gap-0 py-0 border-cream-line shadow-sh-3 overflow-hidden">
          <CardHeader className="gap-1 bg-cream-soft px-6 py-5">
            <CardTitle className="text-h2 font-bold text-ink-900">
              Contact us
            </CardTitle>
            <CardDescription className="text-body-sm text-ink-500">
              We typically respond within a few hours.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">
                    First name <span className="text-orange-600">*</span>
                  </Label>
                  <Input
                    {...bind("firstName")}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">
                    Last name <span className="text-orange-600">*</span>
                  </Label>
                  <Input
                    {...bind("lastName")}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile">
                  Mobile <span className="text-orange-600">*</span>
                </Label>
                <Input
                  {...bind("mobile")}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  placeholder="Enter your 10 digit mobile number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-orange-600">*</span>
                </Label>
                <Input
                  {...bind("email")}
                  type="email"
                  placeholder="Enter your email id"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  {...bind("address")}
                  placeholder="Enter your address"
                  autoComplete="street-address"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  {...bind("message")}
                  rows={4}
                  placeholder="How can we help you?"
                />
              </div>

              <Button
                type="submit"
                disabled={disabled}
                className={cn(
                  "w-full h-12 rounded-pill text-body font-semibold transition-all active:scale-[0.98]",
                  status === "submitted"
                    ? "bg-success text-white hover:bg-success"
                    : "bg-orange-500 text-white hover:bg-orange-600",
                )}
              >
                {status === "submitting" && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                )}
                {status === "submitted" && (
                  <>
                    <Check className="w-4 h-4" />
                    Thanks — we&apos;ll be in touch
                  </>
                )}
                {(status === "idle" || status === "error") && (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </Button>

              {status === "error" && (
                <p className="text-meta text-danger text-center" role="alert">
                  Something went wrong. Please try again or call us directly.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
