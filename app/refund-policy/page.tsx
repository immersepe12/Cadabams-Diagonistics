import type { Metadata } from "next";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How refunds, cancellations, and rescheduling work for lab tests, scans, and health checkups booked with Cadabam's Diagnostics.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <PolicyPageShell
      kind="refund"
      title="Refund & Cancellation Policy"
      summary="Plans change. Here's exactly how cancellations, rescheduling, and refunds work for bookings made with Cadabam's Diagnostics."
      lastUpdated="2026-05-29"
      sections={[
        {
          id: "cancellations",
          title: "Cancellations",
          body: (
            <>
              <p>
                You can cancel any test, scan, or checkup booking and receive
                a refund based on when you cancel:
              </p>
              <ul>
                <li>
                  <strong>More than 2 hours before</strong> the scheduled
                  appointment — full refund to the original payment method.
                </li>
                <li>
                  <strong>Within 2 hours of</strong> the scheduled
                  appointment — no refund (the slot can no longer be
                  reassigned).
                </li>
                <li>
                  <strong>No-shows</strong> — no refund. The booking is
                  treated as a completed visit.
                </li>
              </ul>
              <p>
                To cancel, log in to your account, call{" "}
                <a href="tel:+919900664696">+91 99006 64696</a>, or reply to
                your booking confirmation.
              </p>
            </>
          ),
        },
        {
          id: "rescheduling",
          title: "Rescheduling",
          body: (
            <p>
              Rescheduling is <strong>free up to 1 hour before</strong> the
              appointment. After that we may need to issue a small operational
              fee depending on the test type — our team will tell you the
              exact amount when you call. Rescheduled bookings keep the
              original price you paid.
            </p>
          ),
        },
        {
          id: "refund-timelines",
          title: "Refund timelines",
          body: (
            <>
              <p>Refunds are processed back to the original payment method:</p>
              <ul>
                <li>
                  <strong>UPI</strong> — typically within 24 hours.
                </li>
                <li>
                  <strong>Cards</strong> — 3–5 business days.
                </li>
                <li>
                  <strong>Net banking and wallets</strong> — 5–7 business days.
                </li>
              </ul>
              <p>
                If the original payment method is no longer available (for
                example, a closed card), we will reach out to arrange a bank
                transfer.
              </p>
            </>
          ),
        },
        {
          id: "service-failure",
          title: "If we cannot deliver the service",
          body: (
            <p>
              If a booking cannot be fulfilled for any reason attributable to
              us — phlebotomist no-show, sample spoilage, equipment downtime
              at the centre — we will offer a no-cost reschedule or a full
              refund, whichever you prefer. We&apos;ll also let you know the
              moment the issue is identified so you aren&apos;t kept waiting.
            </p>
          ),
        },
        {
          id: "result-disputes",
          title: "Test-result disputes and retests",
          body: (
            <p>
              If you believe a result is incorrect, contact us within{" "}
              <strong>7 days of receiving the report</strong>. We will
              re-process the sample, or collect a fresh sample if needed, at{" "}
              <strong>no additional cost</strong>. Refunds are not issued for
              tests whose results are clinically valid — even if the result is
              unfavourable — because the test itself was performed correctly.
            </p>
          ),
        },
        {
          id: "package-refunds",
          title: "Packages and multi-test refunds",
          body: (
            <p>
              For health-checkup packages and bundled tests, refunds are
              calculated on the package value, not the individual test list
              price. Tests that have already been performed within a partially
              completed package are deducted at their standalone price before
              refunding the balance.
            </p>
          ),
        },
        {
          id: "non-refundable",
          title: "What is non-refundable",
          body: (
            <ul>
              <li>
                Home-collection convenience fees once the phlebotomist has
                arrived at your address.
              </li>
              <li>
                Reports already generated and shared with you or your
                physician.
              </li>
              <li>Cancellations and no-shows within the cut-offs above.</li>
            </ul>
          ),
        },
        {
          id: "contact",
          title: "Need to talk to us?",
          body: (
            <p>
              Call <a href="tel:+919900664696">+91 99006 64696</a> or email{" "}
              <a href="mailto:info@cadabamsdiagnostics.com">
                info@cadabamsdiagnostics.com
              </a>{" "}
              with your booking ID. Most refund requests are resolved within
              one working day.
            </p>
          ),
        },
      ]}
    />
  );
}
