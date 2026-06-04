"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Check, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactActionButton } from "@/components/shared/ContactActionButton";

interface ContactFormSectionProps {
  logo: string;
  phone?: string;
  email?: string;
  address?: string;
}

type Status = "idle" | "submitting" | "submitted" | "error";

const FRESHSALES_ENDPOINT =
  "https://cadabamsdiagnostics.myfreshworks.com/crm/sales/smart_form/create_entity?file_attachments_present=false";
const FRESHSALES_KEY =
  "bb88c16791f1cb14ef2689824060cde9861d5bfdd5e32975167f8cdb57f7b0b6";

export function ContactFormSection({
  logo,
  phone,
  email,
  address,
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

  const input = (name: keyof typeof form) => ({
    name,
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  return (
    <section id="contact" className="py-8 lg:py-12 bg-cream-bg scroll-mt-20">
      <div className="mx-auto max-w-7xl px-gutter grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 lg:order-2">
          <p className="text-overline uppercase text-orange-600 font-bold">
            Talk to us
          </p>
          <h2 className="text-h1 sm:text-display-2 text-ink-900 font-display leading-tight">
            Have questions? We&apos;re here to help.
          </h2>
          <p className="text-body text-ink-600 leading-relaxed max-w-md">
            Share a few details and our team will reach out — book a test,
            schedule a scan, or ask about home sample collection across Bangalore.
          </p>

          <ul className="space-y-3 text-body-sm pt-2">
            {phone && (
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-pill bg-orange-50 text-orange-600 inline-flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <ContactActionButton
                  mode="call"
                  phone={phone}
                  className="text-left text-ink-900 hover:text-orange-600 transition-colors font-medium"
                >
                  {phone}
                </ContactActionButton>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-pill bg-orange-50 text-orange-600 inline-flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-ink-900 hover:text-orange-600 transition-colors font-medium break-all"
                >
                  {email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-pill bg-orange-50 text-orange-600 inline-flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="text-ink-700">{address}</span>
              </li>
            )}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-cream-card rounded-2xl shadow-sh-3 border border-cream-line p-5 sm:p-6 space-y-4 lg:order-1"
          noValidate
        >

          <h3 className="text-h2 font-bold text-ink-900 text-center">
            Contact us
          </h3>
          

          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="firstName" label="First name">
              <input
                {...input("firstName")}
                id="firstName"
                placeholder="Enter your first name"
                required
                className={fieldInputClass}
              />
            </Field>
            <Field id="lastName" label="Last name">
              <input
                {...input("lastName")}
                id="lastName"
                placeholder="Enter your last name"
                required
                className={fieldInputClass}
              />
            </Field>
          </div>

          <Field id="mobile" label="Mobile">
            <input
              {...input("mobile")}
              id="mobile"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="Enter your 10 digit mobile number"
              required
              className={fieldInputClass}
            />
          </Field>

          <Field id="email" label="Email">
            <input
              {...input("email")}
              id="email"
              type="email"
              placeholder="Enter your email id"
              required
              className={fieldInputClass}
            />
          </Field>

          <Field id="address" label="Address">
            <input
              {...input("address")}
              id="address"
              placeholder="Enter your address"
              className={fieldInputClass}
            />
          </Field>

          <Field id="message" label="Message">
            <textarea
              name="message"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              id="message"
              rows={4}
              placeholder="How can we help you?"
              className={cn(fieldInputClass, "min-h-24 resize-y")}
            />
          </Field>

          <button
            type="submit"
            disabled={status === "submitting" || status === "submitted"}
            className={cn(
              "w-full inline-flex items-center justify-center px-6 py-3 rounded-pill font-semibold text-body shadow-glow-orange transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
              status === "submitted"
                ? "bg-success text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-70 disabled:cursor-not-allowed",
            )}
          >
            {status === "submitting" && "Submitting…"}
            {status === "submitted" && (
              <>
                <Check className="w-4 h-4 mr-2" />
                Thanks — we&apos;ll be in touch
              </>
            )}
            {(status === "idle" || status === "error") && "Submit"}
          </button>

          {status === "error" && (
            <p className="text-meta text-danger text-center -mt-2">
              Something went wrong. Please try again or call us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

const fieldInputClass =
  "w-full bg-cream-soft text-ink-900 rounded-md border border-cream-line focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-cream-card transition-all duration-200 px-4 py-2.5 text-body-sm placeholder:text-ink-400";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-meta font-semibold text-ink-700 mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
