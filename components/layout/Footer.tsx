import Image from "next/image";
import Link from "next/link";
import { getNavbar } from "@/lib/data/navbars";
import { getAllCenters } from "@/lib/data/centers";
import { getLabTestById } from "@/lib/data/labtests";
import { getNonLabTestById } from "@/lib/data/nonlabtests";
import { getHomepage } from "@/lib/data/homepages";
import { centerUrl, labTestUrl, nonLabTestUrl } from "@/lib/urls";
import { titleCaseTestName } from "@/lib/format";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const COMPANY_LINKS: FooterLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Management Team", href: "/management-team" },
  { label: "Clinical Team", href: "/clinical-team" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact-us" },
];

const SERVICE_LINKS: FooterLink[] = [
  { label: "Lab Tests", href: "/bangalore/lab-test" },
  { label: "X-Ray Scans", href: "/bangalore/xray-scan" },
  { label: "MRI Scans", href: "/bangalore/mri-scan" },
  { label: "Ultrasound Scans", href: "/bangalore/ultrasound-scan" },
  { label: "Pregnancy Scans", href: "/bangalore/pregnancy-scan" },
  { label: "MSK Scans", href: "/bangalore/msk-scan" },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Legal", href: "/legal" },
];

function buildCentresColumn(): FooterColumn {
  return {
    heading: "Diagnostic Centres",
    links: getAllCenters().map((c) => ({
      label: c.basic_info.area
        .replace(/-/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase()),
      href: centerUrl(c),
    })),
  };
}

function buildPopularLabTestsColumn(): FooterColumn {
  const home = getHomepage();
  const ids = home.healthMonitoring.content
    .map((item) => item.test)
    .filter((id): id is string => Boolean(id));
  const links: FooterLink[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    const test = getLabTestById(id);
    if (!test) continue;
    seen.add(id);
    links.push({ label: titleCaseTestName(test.testName), href: labTestUrl(test) });
    if (links.length >= 6) break;
  }
  return { heading: "Popular Lab Tests", links };
}

function buildPopularScansColumn(): FooterColumn {
  const home = getHomepage();
  const links: FooterLink[] = [];
  const seen = new Set<string>();
  for (const c of home.mostBookedCheckups.checkups) {
    if (seen.has(c.href)) continue;
    const test = getNonLabTestById(c.href);
    if (!test) continue;
    seen.add(c.href);
    links.push({ label: titleCaseTestName(test.testName), href: nonLabTestUrl(test) });
    if (links.length >= 6) break;
  }
  return { heading: "Popular Radiology Tests", links };
}

export function Footer() {
  const navbar = getNavbar();
  const year = new Date().getFullYear();

  const columns: FooterColumn[] = [
    { heading: "Company", links: COMPANY_LINKS },
    { heading: "Services", links: SERVICE_LINKS },
    buildCentresColumn(),
    buildPopularLabTestsColumn(),
    buildPopularScansColumn(),
  ];

  return (
    <footer className="bg-deep-800 text-ink-200 mt-12">
      <div className="mx-auto max-w-7xl px-gutter py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:gap-8">
          <div className="space-y-4 max-w-xs col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              aria-label="Cadabams Diagnostics home"
              className="inline-flex items-center bg-cream-card rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-800"
            >
              <Image
                src={navbar.content.logo}
                alt="Cadabams Diagnostics"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-body-sm text-ink-300 leading-relaxed">
              Accurate diagnostics, compassionate care. Trusted lab tests and
              radiology across Bangalore.
            </p>
          </div>

          {columns.map((col) => (
            <FooterColumnBlock key={col.heading} column={col} />
          ))}
        </div>
      </div>

      <div className="border-t border-deep-600">
        <div className="mx-auto max-w-7xl px-gutter pt-6 pb-10 sm:py-6 flex flex-col items-center gap-3 text-center text-meta text-ink-400 sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {LEGAL_LINKS.map((l, i) => (
              <li key={l.href} className="flex items-center gap-x-3">
                {i > 0 && (
                  <span aria-hidden className="text-deep-600">
                    |
                  </span>
                )}
                <Link
                  href={l.href}
                  className="hover:text-orange-400 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>© {year} Cadabam&apos;s Diagnostics Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumnBlock({ column }: { column: FooterColumn }) {
  if (column.links.length === 0) return null;
  return (
    <div>
      <h3 className="text-overline uppercase text-orange-400 font-bold mb-4">
        {column.heading}
      </h3>
      <ul className="space-y-2.5">
        {column.links.map((l) => (
          <li key={l.label + l.href}>
            <Link
              href={l.href}
              className="text-body-sm text-ink-300 hover:text-orange-400 transition-colors duration-150 focus-visible:outline-none focus-visible:text-orange-400 focus-visible:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
