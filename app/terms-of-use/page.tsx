import type { Metadata } from "next";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms and conditions that apply when you use cadabamsdiagnostics.com and book services through it.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/terms-of-use" },
};

export default function TermsOfUsePage() {
  return (
    <PolicyPageShell
      kind="terms"
      title="Terms of Use"
      summary="These terms govern your use of cadabamsdiagnostics.com and any services you book through it. By using the site, you agree to be bound by them."
      lastUpdated="2026-05-29"
      sections={[
        {
          id: "acceptance",
          title: "Acceptance of these terms",
          body: (
            <>
              <p>
                By accessing or using cadabamsdiagnostics.com, the Cadabam&apos;s
                Diagnostics mobile experience, or any service we deliver
                through them, you agree to be bound by these Terms of Use and
                our <a href="/privacy-policy">Privacy Policy</a>. If you do
                not agree, please do not use the site.
              </p>
              <p>
                We may update these terms from time to time. Material changes
                will be highlighted at the top of this page. Continuing to use
                the site after a change means you accept the updated terms.
              </p>
            </>
          ),
        },
        {
          id: "use-of-site",
          title: "Use of the website",
          body: (
            <>
              <p>
                Content on this site — including test descriptions, sample
                preparation guides, blog articles, and health insights — is
                provided for general information only and is{" "}
                <strong>not a substitute for professional medical advice</strong>.
                Always consult a qualified clinician for diagnosis and
                treatment decisions.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use the site for any unlawful, fraudulent, or harmful
                  purpose.
                </li>
                <li>
                  Attempt to gain unauthorised access to any portion of the
                  site, our servers, or another user&apos;s account.
                </li>
                <li>
                  Reproduce, scrape, or republish content without our prior
                  written permission.
                </li>
                <li>
                  Interfere with the security, availability, or integrity of
                  the site.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "accounts",
          title: "Accounts and bookings",
          body: (
            <>
              <p>
                Some features — including booking tests, viewing reports, and
                managing family profiles — require an account. You are
                responsible for keeping your login credentials confidential
                and for all activity that takes place under your account.
              </p>
              <p>
                Bookings are subject to availability and to confirmation by
                our team. Prices shown on the site are in INR and inclusive of
                applicable taxes unless stated otherwise. Prices may change
                without notice; the price confirmed at checkout is the price
                that applies to your booking.
              </p>
            </>
          ),
        },
        {
          id: "payments-refunds",
          title: "Payments, cancellations and refunds",
          body: (
            <>
              <p>
                Payment for a booking is collected at checkout or at the time
                of sample collection, depending on the option you choose.
                Cancellations and refunds are handled under our{" "}
                <a href="/refund-policy">Refund Policy</a>.
              </p>
              <p>
                If your booking cannot be fulfilled for any reason
                attributable to us, we will offer a reschedule or a full
                refund to the original payment method.
              </p>
            </>
          ),
        },
        {
          id: "intellectual-property",
          title: "Intellectual property",
          body: (
            <>
              <p>
                All content on this site — including text, images, logos,
                clinical-content templates, photography, software, and reports
                — is the property of Cadabam&apos;s Diagnostics or our
                licensors and is protected by copyright and trademark laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create
                derivative works of any part of this site without our prior
                written consent. Personal, non-commercial use within the
                normal functioning of the site (viewing pages, downloading
                your own reports) is permitted.
              </p>
            </>
          ),
        },
        {
          id: "third-parties",
          title: "Third-party links and services",
          body: (
            <p>
              The site may contain links to third-party websites or embed
              services we do not control (such as maps, payment gateways, or
              analytics tools). We are not responsible for their content,
              privacy practices, or availability. Your use of those services
              is governed by their own terms.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Disclaimers and limitation of liability",
          body: (
            <>
              <p>
                The site is provided on an <strong>as-is</strong> and{" "}
                <strong>as-available</strong> basis. To the maximum extent
                permitted by law, Cadabam&apos;s Diagnostics disclaims all
                warranties, express or implied, including any warranty of
                merchantability, fitness for a particular purpose, or
                non-infringement.
              </p>
              <p>
                We will not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or for any loss of
                profits, data, or goodwill, arising out of or in connection
                with your use of the site, even if we have been advised of
                the possibility of such damages.
              </p>
            </>
          ),
        },
        {
          id: "governing-law",
          title: "Governing law and jurisdiction",
          body: (
            <p>
              These Terms of Use are governed by the laws of India. Any
              dispute arising out of or in connection with the site or these
              terms will be subject to the exclusive jurisdiction of the
              courts at Bangalore, Karnataka.
            </p>
          ),
        },
      ]}
    />
  );
}
