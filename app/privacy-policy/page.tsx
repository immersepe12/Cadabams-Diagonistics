import type { Metadata } from "next";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Cadabam's Diagnostics collects, uses, and protects your personal and health information.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageShell
      kind="privacy"
      title="Privacy Policy"
      summary="Your health information is sensitive. Here's exactly what we collect, why, how we protect it, and the controls you have over it."
      lastUpdated="2026-05-29"
      sections={[
        {
          id: "what-we-collect",
          title: "What we collect",
          body: (
            <>
              <p>We collect only what we need to deliver safe diagnostic care:</p>
              <ul>
                <li>
                  <strong>Identifying details</strong> you provide — name,
                  age, gender, phone number, email, and address used for
                  sample collection and report delivery.
                </li>
                <li>
                  <strong>Booking data</strong> — tests and scans you book,
                  centre and time chosen, payment receipts, and prescriptions
                  you upload.
                </li>
                <li>
                  <strong>Clinical information</strong> generated during your
                  tests — sample readings, images, and physician
                  interpretations that make up your report.
                </li>
                <li>
                  <strong>Site usage</strong> — anonymised analytics such as
                  pages viewed, device type, and approximate location, used to
                  improve the site experience.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "how-we-use",
          title: "How we use your information",
          body: (
            <>
              <p>We use your information to:</p>
              <ul>
                <li>
                  Schedule appointments, coordinate home sample collection,
                  and run your tests.
                </li>
                <li>
                  Deliver reports to you via app, email, or WhatsApp and
                  notify you when results are ready.
                </li>
                <li>
                  Contact you about your bookings — confirmations, reminders,
                  rescheduling, or post-test follow-ups.
                </li>
                <li>
                  Improve our services and content, troubleshoot issues, and
                  detect fraud or misuse.
                </li>
                <li>
                  Meet legal, regulatory, and accreditation obligations
                  (including NABL audit requirements).
                </li>
              </ul>
              <p>
                <strong>We do not sell your personal or health data</strong> to
                advertisers or data brokers.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: (
            <>
              <p>Your data is shared only when necessary, and only with:</p>
              <ul>
                <li>
                  <strong>Your referring physician</strong>, if you have asked
                  us to send the report to them.
                </li>
                <li>
                  <strong>Our clinical and operations teams</strong>, on a
                  role-based, need-to-know basis to complete your booking.
                </li>
                <li>
                  <strong>Trusted service providers</strong> — payment
                  gateways, sample logistics, secure cloud hosting, and SMS /
                  email delivery partners — under contract to protect your
                  data and use it only for the service we engage them for.
                </li>
                <li>
                  <strong>Regulators or courts</strong>, if we are legally
                  required to disclose specific information.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "protection",
          title: "How we protect it",
          body: (
            <>
              <p>
                We use industry-standard safeguards designed for health data:
              </p>
              <ul>
                <li>Encryption in transit (TLS) and at rest.</li>
                <li>
                  Role-based access for our clinical team, with the minimum
                  privileges needed for each role.
                </li>
                <li>
                  Audit logs on every record access, reviewed regularly.
                </li>
                <li>
                  Physical reports stored in secure, access-controlled rooms
                  at our centres.
                </li>
                <li>
                  Periodic security reviews, vulnerability scans, and staff
                  training on data handling.
                </li>
              </ul>
              <p>
                No system is perfectly secure. If we ever become aware of a
                breach that affects your data, we will notify you promptly in
                line with applicable law.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: (
            <p>
              Clinical records are retained for the periods required under
              applicable medical-records regulations (typically several years
              after the last interaction). Non-clinical data, such as
              marketing preferences, is kept only while it is needed for the
              purpose we collected it. You can ask us to delete or anonymise
              data we are not required to keep.
            </p>
          ),
        },
        {
          id: "your-rights",
          title: "Your rights",
          body: (
            <>
              <p>At any time you can:</p>
              <ul>
                <li>Request a copy of the records we hold about you.</li>
                <li>Correct inaccurate or outdated details.</li>
                <li>
                  Withdraw consent for non-clinical communication such as
                  marketing emails or wellness tips.
                </li>
                <li>
                  Ask us to delete data we are not legally required to keep.
                </li>
              </ul>
              <p>
                Email{" "}
                <a href="mailto:info@cadabamsdiagnostics.com">
                  info@cadabamsdiagnostics.com
                </a>{" "}
                with the subject line &ldquo;Privacy request&rdquo; and we will
                respond within 30 days.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children's information",
          body: (
            <p>
              If a child is the patient, we collect their clinical details
              under the consent of a parent or legal guardian. We do not
              market our services to children directly.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: (
            <p>
              We will update this policy when our practices change or when
              required by law. The &ldquo;Last updated&rdquo; date at the top
              of the page reflects the most recent revision. Material changes
              will be highlighted at the top.
            </p>
          ),
        },
      ]}
    />
  );
}
