import type { Metadata } from "next";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Legal information, disclaimers, accreditation, and entity details for Cadabam's Diagnostics.",
  alternates: { canonical: "https://cadabamsdiagnostics.com/legal" },
};

export default function LegalPage() {
  return (
    <PolicyPageShell
      kind="legal"
      title="Legal Information"
      summary="Quick links to our policies, plus important disclaimers, accreditation details, and how to reach our legal team."
      lastUpdated="2026-05-29"
      sections={[
        {
          id: "medical-disclaimer",
          title: "Medical disclaimer",
          body: (
            <>
              <p>
                Content on this site — test descriptions, sample-preparation
                guides, health blogs, and report explainers — is for general
                awareness about the diagnostic services we offer. It is{" "}
                <strong>not a substitute for professional medical advice,
                diagnosis, or treatment</strong>.
              </p>
              <p>
                Always consult a qualified clinician for diagnosis, treatment,
                or interpretation of your results. Do not delay seeking medical
                advice based on something you read here.
              </p>
            </>
          ),
        },
        {
          id: "accreditation",
          title: "Accreditation and quality",
          body: (
            <>
              <p>
                Cadabam&apos;s Diagnostics laboratories are accredited by the{" "}
                <strong>National Accreditation Board for Testing and
                Calibration Laboratories (NABL)</strong>. Our clinical
                processes follow standard operating procedures aligned with
                ISO 15189 for medical laboratories.
              </p>
              <p>
                Internal quality controls, external proficiency testing,
                periodic equipment calibration, and regular staff training
                form the backbone of how we keep results reliable.
              </p>
            </>
          ),
        },
        {
          id: "entity",
          title: "Entity details",
          body: (
            <>
              <p>
                Cadabam&apos;s Diagnostics is operated by{" "}
                <strong>Cadabams Health Care Pvt. Ltd.</strong>, with its
                registered office in Bengaluru, Karnataka, India.
              </p>
              <p>
                For corporate, partnership, or media enquiries, write to{" "}
                <a href="mailto:info@cadabamsdiagnostics.com">
                  info@cadabamsdiagnostics.com
                </a>
                . For service-related queries, please use the{" "}
                <a href="/contact-us">Contact us</a> page.
              </p>
            </>
          ),
        },
        {
          id: "intellectual-property",
          title: "Intellectual property",
          body: (
            <p>
              The Cadabam&apos;s Diagnostics name, logo, marks, branding, and
              all original content on this site are the property of Cadabams
              Health Care Pvt. Ltd. or its licensors. You may not reproduce,
              redistribute, or create derivative works of any part of this
              site without prior written consent, except as permitted by our{" "}
              <a href="/terms-of-use">Terms of Use</a>.
            </p>
          ),
        },
        {
          id: "grievance",
          title: "Grievance redressal",
          body: (
            <>
              <p>
                If you believe a service, report, or interaction with us has
                fallen short of what you expected, please raise it with our
                Grievance Officer.
              </p>
              <ul>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@cadabamsdiagnostics.com">
                    info@cadabamsdiagnostics.com
                  </a>{" "}
                  with the subject line &ldquo;Grievance&rdquo;.
                </li>
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+919900664696">+91 99006 64696</a> (Mon–Sat,
                  9 am – 6 pm).
                </li>
                <li>
                  Include your booking ID, the centre or service involved, and
                  a brief description of the concern.
                </li>
              </ul>
              <p>
                We aim to acknowledge every grievance within 2 working days
                and resolve it within 15 working days.
              </p>
            </>
          ),
        },
        {
          id: "jurisdiction",
          title: "Governing law and jurisdiction",
          body: (
            <p>
              Use of this site and any services booked through it are
              governed by the laws of India. Any dispute arising in connection
              with the site or our services is subject to the exclusive
              jurisdiction of the competent courts at Bangalore, Karnataka.
            </p>
          ),
        },
        {
          id: "report-issue",
          title: "Report a security or content issue",
          body: (
            <p>
              If you believe you have found a security vulnerability or
              inaccurate medical content on the site, email{" "}
              <a href="mailto:info@cadabamsdiagnostics.com">
                info@cadabamsdiagnostics.com
              </a>{" "}
              with the subject &ldquo;Security report&rdquo; or &ldquo;Content
              correction&rdquo;. Please don&apos;t share details publicly
              until we have had a chance to address them.
            </p>
          ),
        },
      ]}
    />
  );
}
