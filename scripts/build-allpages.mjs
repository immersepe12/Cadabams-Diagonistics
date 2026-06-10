/**
 * build-allpages.mjs
 * -------------------------------------------------------------------------
 * Splits the canonical collections in `data/allpages/_shared/*` into ONE
 * self-contained JSON file per page, written into a route-mirrored folder tree
 * under `data/allpages/<route>/page.json`.
 *
 * The folder structure mirrors the public URL of each page exactly:
 *   /                                  -> data/allpages/page.json
 *   /bangalore/ct-scan                 -> data/allpages/bangalore/ct-scan/page.json
 *   /bangalore/ct-scan/brain-ct-scan   -> data/allpages/bangalore/ct-scan/brain-ct-scan/page.json
 *   /blogs/<slug>                      -> data/allpages/blogs/<slug>/page.json
 *   /about-us                          -> data/allpages/about-us/page.json
 *
 * Each page.json carries everything that page needs to render (the page's own
 * entity plus its already-resolved related entities), so a page can be built
 * purely by importing "its" file. A `_manifest.json` index lists every route.
 *
 * Run:  node scripts/build-allpages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as STATIC from "./static-pages-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data", "allpages");
// Canonical collections (source of truth) live alongside the generated route
// files, under data/allpages/_shared. These back site-wide concerns (search,
// nav, related-test lookups) that span every route and aren't a single page.
const SRC = path.join(OUT, "_shared");
const CITY = "bangalore";

const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(SRC, `${name}.json`), "utf8"));

// ---- helpers -------------------------------------------------------------
const stripLeadingSlash = (s) => (s ? String(s).replace(/^\/+/, "") : "");
const slugifyLocation = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

let written = 0;
function writePage(routeSegments, payload) {
  // routeSegments: array of clean path segments (no leading/trailing slash).
  const dir = path.join(OUT, ...routeSegments);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "page.json"),
    JSON.stringify(payload, null, 2),
  );
  written++;
}

// ---- load source data ----------------------------------------------------
const nonLabTests = read("nonlabtests");
const nonLabCategories = read("nonlabtest-categories");
const labTests = read("labtests");
const labCategories = read("labtest-categories");
const blogs = read("blogs").filter((b) => b.pageState === "publish");
const centers = read("centerpages");
const homepage = (() => {
  const d = read("homepages");
  return Array.isArray(d) ? d[0] : d;
})();
const navbar = (() => {
  const d = read("navbars");
  return Array.isArray(d) ? d[0] : d;
})();

const nonLabCatById = new Map(nonLabCategories.map((c) => [c.id, c]));
const nonLabTestById = new Map(nonLabTests.map((t) => [t.id, t]));
const labTestById = new Map(labTests.map((t) => [t.id, t]));
const labCatById = new Map(labCategories.map((c) => [c.id, c]));

const nonLabCatSlug = (c) => stripLeadingSlash(c.path);
const labCatSlug = (c) => stripLeadingSlash(c.path);

// Price helpers mirroring lib/data/labtests.ts
const priceNum = (test) => {
  const raw = test?.basic_info?.price;
  if (typeof raw === "number") return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};
const discountedNum = (test) => {
  const n = Number(test?.basic_info?.discountedPrice);
  return Number.isFinite(n) ? n : priceNum(test);
};
const discountPctOf = (test) => {
  const p = priceNum(test);
  const dp = discountedNum(test);
  const stated = Number(test?.basic_info?.discount);
  const computed = p > dp ? Math.round(((p - dp) / p) * 100) : 0;
  return stated > 0 ? stated : computed;
};
// Mirrors getCenterShortName / centerUrl in lib.
const centerShortName = (c) =>
  String(
    c.basic_info?.location?.trim() ||
      c.basic_info?.area?.trim() ||
      c.basic_info?.center_name?.trim() ||
      "",
  )
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
const labTestUrl = (t) => `/${CITY}/lab-test/${stripLeadingSlash(t.route)}`;

// FAQ copy shown on the home page (kept here so the page file is the source).
const HOME_FAQS = [
  {
    question:
      "What types of tests and scans are available at Cadabam's Diagnostics?",
    answer:
      "We offer a comprehensive range of diagnostic services, including lab tests like Complete Blood Count, Liver Function Test, Glucose Fasting, and specialized tests such as Thyroid Profile. Additionally, we provide advanced imaging services like X-rays, MRIs, CT scans, Ultrasounds, and Pregnancy Scans, ensuring a one-stop solution for all your diagnostic needs.",
  },
  {
    question:
      "Do I need to visit the centre for sample collection, or do you offer home collection services?",
    answer:
      "For lab tests, we provide the convenience of home sample collection. Our certified professionals will visit your home at the scheduled time, ensuring a safe and hygienic process. Additionally, we have over 70 sample collection points across Bangalore, making it even easier for you to find a location nearby if you prefer to visit one of our centres.",
  },
  {
    question: "How quickly can I expect my test or scan results?",
    answer:
      "At Cadabam's Diagnostics, we prioritise accuracy and speed. Most lab test results are available within a few hours and are sent directly to you via WhatsApp, email, or through other digital form. For scans, results and reports are generally available within 24 to 48 hours, depending on the type of imaging.",
  },
];

const manifest = [];
const track = (route, type) => manifest.push({ route, type });

// ---- 1. NON-LAB (scan) listing pages ------------------------------------
for (const cat of nonLabCategories) {
  const family = nonLabCatSlug(cat);
  if (!family) continue;
  const tests = nonLabTests.filter(
    (t) => t.basic_info?.categoryId === cat.id && t.testName?.trim(),
  );
  const route = `/${CITY}/${family}`;
  writePage([CITY, family], {
    type: "scan-listing",
    route,
    familyPath: family,
    category: cat,
    tests,
  });
  track(route, "scan-listing");
}

// ---- 2. NON-LAB (scan) detail pages -------------------------------------
for (const test of nonLabTests) {
  const slug = stripLeadingSlash(test.route);
  if (!slug) continue;
  const cat = nonLabCatById.get(test.basic_info?.categoryId);
  const family = cat ? nonLabCatSlug(cat) : "scan";
  const relatedTests = (test.relative_test?.tests || [])
    .map((r) => nonLabTestById.get(r.id))
    .filter((t) => t && t.id !== test.id && t.testName?.trim());
  const route = `/${CITY}/${family}/${slug}`;
  writePage([CITY, family, slug], {
    type: "scan-detail",
    route,
    familyPath: family,
    slug,
    test,
    category: cat || null,
    relatedTests,
  });
  track(route, "scan-detail");
}

// ---- 3. LAB-TEST listing + category listings ----------------------------
writePage([CITY, "lab-test"], {
  type: "labtest-listing",
  route: `/${CITY}/lab-test`,
  categories: labCategories,
  tests: labTests.filter((t) => t.testName?.trim()),
});
track(`/${CITY}/lab-test`, "labtest-listing");

for (const cat of labCategories) {
  const slug = labCatSlug(cat);
  if (!slug) continue;
  const tests = labTests.filter(
    (t) => t.basic_info?.categoryId === cat.id && t.testName?.trim(),
  );
  const route = `/${CITY}/lab-test/${slug}`;
  writePage([CITY, "lab-test", slug], {
    type: "labtest-category-listing",
    route,
    categorySlug: slug,
    category: cat,
    tests,
  });
  track(route, "labtest-category-listing");
}

// ---- 4. LAB-TEST detail pages -------------------------------------------
for (const test of labTests) {
  const slug = stripLeadingSlash(test.route);
  if (!slug) continue;
  const cat = labCatById.get(test.basic_info?.categoryId) || null;
  const relatedTests = (test.relative_test?.tests || [])
    .map((r) => labTestById.get(r.id))
    .filter((t) => t && t.id !== test.id && t.testName?.trim());
  const route = `/${CITY}/lab-test/${slug}`;
  writePage([CITY, "lab-test", slug], {
    type: "labtest-detail",
    route,
    slug,
    test,
    category: cat,
    relatedTests,
  });
  track(route, "labtest-detail");
}

// ---- 5. CENTER pages -----------------------------------------------------
for (const center of centers) {
  const slug = slugifyLocation(center.basic_info?.location);
  if (!slug) continue;
  const route = `/${CITY}/center/${slug}`;
  writePage([CITY, "center", slug], {
    type: "center",
    route,
    slug,
    center,
  });
  track(route, "center");
}

// ---- 6. BLOG listing + detail pages -------------------------------------
writePage(["blogs"], {
  type: "blog-listing",
  route: "/blogs",
  blogs: blogs.map((b) => ({
    id: b.id,
    title: b.title,
    route: b.route,
    categoryName: b.categoryName,
    imageUrl: b.imageUrl,
    updatedAt: b.updatedAt,
  })),
});
track("/blogs", "blog-listing");

for (const blog of blogs) {
  const slug = stripLeadingSlash(blog.route);
  if (!slug) continue;
  const route = `/blogs/${slug}`;
  writePage(["blogs", slug], { type: "blog-detail", route, slug, blog });
  track(route, "blog-detail");
}

// ---- 7. STATIC / top-level pages ----------------------------------------
// Resolved centre summaries reused by several static pages.
const centreSummaries = centers
  .filter((c) => c.basic_info?.center_name?.trim())
  .map((c) => ({
    id: c.id,
    name: c.basic_info.center_name.trim(),
    area: c.basic_info?.area || "",
    image: c.basic_info?.center_image || "",
    address: c.center_info?.address || "",
    phone:
      c.center_info?.phone?.split(",")[0]?.trim() || c.center_info?.phone || "",
    email: c.center_info?.email || "",
    href: `/${CITY}/center/${slugifyLocation(c.basic_info?.location)}`,
    weekdays: c.working_hours?.weekdays || null,
    sunday: c.working_hours?.sunday || null,
  }));
const primaryCentre = centers[0];

// management-team
writePage(["management-team"], {
  type: "management-team",
  route: "/management-team",
  ...STATIC.managementTeam,
});
track("/management-team", "management-team");

// clinical-team (inject specialist count into the stats placeholder)
{
  const ct = STATIC.clinicalTeam;
  const stats = ct.stats.map((s) =>
    s.value === "__COUNT__" ? { ...s, value: String(ct.doctors.length) } : s,
  );
  writePage(["clinical-team"], {
    type: "clinical-team",
    route: "/clinical-team",
    ...ct,
    stats,
  });
  track("/clinical-team", "clinical-team");
}

// contact-us (resolved centres + contact-form fields)
writePage(["contact-us"], {
  type: "contact-us",
  route: "/contact-us",
  ...STATIC.contact,
  centres: centreSummaries,
  contactForm: {
    logo: navbar?.content?.logo,
    phone:
      primaryCentre?.center_info?.phone?.split(",")[0]?.trim() ||
      primaryCentre?.center_info?.phone,
    email: primaryCentre?.center_info?.email,
    address: primaryCentre?.center_info?.address,
  },
});
track("/contact-us", "contact-us");

// /bangalore landing (services + resolved centres)
writePage([CITY], {
  type: "bangalore-landing",
  route: `/${CITY}`,
  ...STATIC.bangaloreLanding,
  centres: centreSummaries,
});
track(`/${CITY}`, "bangalore-landing");

// auth shells
writePage(["login"], { type: "auth", route: "/login", ...STATIC.login });
track("/login", "auth");
writePage(["signup"], { type: "auth", route: "/signup", ...STATIC.signup });
track("/signup", "auth");

// cart (static copy; live items come from the client cart store)
writePage(["cart"], { type: "cart", route: "/cart", ...STATIC.cart });
track("/cart", "cart");

// policy pages (markdown section bodies)
for (const [slug, policy] of Object.entries(STATIC.policies)) {
  writePage([slug], { type: "policy", route: `/${slug}`, ...policy });
  track(`/${slug}`, "policy");
}

// ---- 7a. ABOUT US (rich, fully-resolved content) ------------------------
{
  const aboutCenters = centers
    .filter((c) => c.basic_info?.center_name?.trim())
    .map((c) => ({
      id: c.id,
      name: c.basic_info.center_name.trim(),
      address: c.center_info?.address || "",
      phone:
        c.center_info?.phone?.split(",")[0]?.trim() ||
        c.center_info?.phone ||
        "",
      href: `/${CITY}/center/${slugifyLocation(c.basic_info?.location)}`,
    }));

  writePage(["about-us"], {
    type: "about-us",
    route: "/about-us",
    hero: {
      badge: "Our Story",
      title: "Accurate diagnostics, compassionate care.",
      description:
        "Cadabam's Diagnostics is a Bangalore-based network of advanced diagnostic centres. We combine modern equipment, accredited labs, and specialist-led reporting so you get answers you can trust — fast.",
      buttons: [
        { label: "Book a test", href: "/bangalore/lab-test", icon: "Beaker" },
        { label: "Find a centre", href: "#our-centres", icon: "Building2" },
      ],
      stats: [
        { value: "60", label: "Mins home collection", icon: "Clock" },
        { value: "1M+", label: "Happy patients", icon: "Users" },
        { value: "4.9", label: "Google rating", icon: "Award" },
        { value: "5", label: "Centres in Bangalore", icon: "Building2" },
      ],
    },
    mission: {
      overline: "What drives us",
      title: "Vital health insights, without the wait.",
      body: [
        "We started Cadabam's Diagnostics with a simple idea: accessing vital health insights shouldn't mean sacrificing comfort. From routine blood work to advanced MRI imaging, every test should be handled with care, accuracy, and respect for your time.",
        "Today, our team delivers reports in 6 hours for most lab tests, same-day reads for routine scans, and second opinions from specialists with 15+ years of experience — across 5 centres and a city-wide home-collection network.",
      ],
      highlights: [
        { icon: "Clock", text: "Reports in 6 hours" },
        { icon: "ShieldCheck", text: "NABL Accredited" },
        { icon: "HeartPulse", text: "Home collection" },
        { icon: "BadgeCheck", text: "Specialist reviewed" },
      ],
      image: {
        src: "/centers/image-1731905681968-88542235.webp",
        alt: "Cadabam's Diagnostics centre",
      },
      badge: { label: "Accredited", value: "NABL Certified", icon: "Award" },
    },
    values: {
      overline: "How we work",
      title: "Four principles, every single test.",
      items: [
        {
          icon: "Microscope",
          title: "Advanced equipment",
          body: "3T MRI, multi-slice CT, GE Healthcare X-ray, and high-resolution ultrasound — calibrated and serviced on a strict schedule.",
        },
        {
          icon: "Award",
          title: "Accredited labs",
          body: "NABL-aligned quality controls, double-blind review on critical tests, and consistent reference ranges across every centre.",
        },
        {
          icon: "HeartPulse",
          title: "Patient-first care",
          body: "Reports in 6 hours for most lab tests, gentle staff, transparent pricing, and free home sample collection across Bangalore.",
        },
        {
          icon: "Activity",
          title: "Specialist-led reporting",
          body: "Reports reviewed by radiologists with 15–25 years of fetal medicine, MSK imaging, and diagnostic experience.",
        },
      ],
    },
    services: {
      overline: "What we offer",
      title: "From routine bloodwork to advanced imaging.",
      labTestCount: labTests.length,
      scanCount: nonLabTests.length,
      items: [
        {
          icon: "Beaker",
          title: "Lab tests",
          body: "Blood, hormones, vitamins, liver, kidney, heart and more — 1500+ tests with home collection.",
          href: "/bangalore/lab-test",
        },
        {
          icon: "Activity",
          title: "Radiology scans",
          body: "X-Ray, MRI, CT, Ultrasound, MSK and pregnancy scans on modern, regularly-calibrated equipment.",
          href: "/bangalore/xray-scan",
        },
        {
          icon: "ShieldCheck",
          title: "Preventive checkups",
          body: "Curated health checkup packages so you can stay ahead of your health rather than reacting to it.",
          href: "/bangalore/preventive-health-checks",
        },
        {
          icon: "Stethoscope",
          title: "Specialist consultations",
          body: "Connect with radiologists and clinicians for second opinions and report walk-throughs.",
          href: "/contact-us",
        },
      ],
    },
    milestones: {
      overline: "The journey so far",
      title: "From one centre to a city-wide network.",
      items: [
        {
          year: "2020",
          title: "Cadabam's Diagnostics is founded",
          body: "Our flagship Banashankari centre opens, bringing hospital-grade radiology to Bangalore neighbourhoods.",
        },
        {
          year: "2021",
          title: "NABL accreditation",
          body: "Our lab achieves NABL accreditation for medical testing, formalising the QA processes we built from day one.",
        },
        {
          year: "2023",
          title: "Network grows to 5 centres",
          body: "Indiranagar, Kanakapura Road, Jayanagar, and Kalyan Nagar centres open with consistent SOPs and reference ranges.",
        },
        {
          year: "2025",
          title: "1M+ tests delivered",
          body: "We cross a million tests delivered across Bangalore with reports in under 6 hours on most lab tests.",
        },
      ],
    },
    centres: {
      overline: "Find us",
      description:
        "Same equipment quality, same SOPs, same reference ranges — at every Cadabam's Diagnostics centre across Bangalore.",
      items: aboutCenters,
    },
    cta: {
      overline: "Ready when you are",
      title: "Book your test in under a minute.",
      description:
        "Walk-in, home sample collection, or a centre visit — choose what fits your day. We'll handle the rest.",
      primary: { label: "Book a lab test", href: "/bangalore/lab-test", icon: "Beaker" },
      call: { label: "Talk to us", phone: "+91 99006 64696", icon: "Phone" },
    },
  });
  track("/about-us", "about-us");
}

// Home page (route "/") — fully-resolved payload matching app/page.tsx
{
  const featuredCards = (homepage.test_card?.tests || [])
    .map((id) => labTestById.get(id))
    .filter(Boolean)
    .map((test) => ({
      id: test.id,
      name: test.testName,
      href: labTestUrl(test),
      reportsWithin: test.basic_info.reportsWithin,
      price: priceNum(test),
      discountedPrice: discountedNum(test),
      discountPct: discountPctOf(test),
      kind: "Lab Test",
    }));

  const monitoringCards = (homepage.healthMonitoring?.content || [])
    .map((item) => {
      const test = labTestById.get(item.test);
      if (!test) return null;
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        imageSrc: item.imageSrc,
        trustedBy: item.trustedBy,
        reportsWithin: test.basic_info.reportsWithin,
        price: priceNum(test),
        discountedPrice: discountedNum(test),
        discountPct: discountPctOf(test),
        detailHref: labTestUrl(test),
      };
    })
    .filter(Boolean);

  const vitalOrgansBlock = homepage.vitalOrgans?.[0] || null;
  const resolvedOrganCats = (vitalOrgansBlock?.all_test_categories || [])
    .map((id) => nonLabCatById.get(id))
    .filter((c) => c && c.name?.trim());
  const organCategories =
    resolvedOrganCats.length > 0
      ? resolvedOrganCats
      : nonLabCategories.filter((c) => c.name?.trim());

  const visitCenters = centers.map((c) => ({
    name: centerShortName(c),
    address: (c.center_info?.address || "").replace(/\s+/g, " ").trim(),
    href: `/${CITY}/center/${slugifyLocation(c.basic_info?.location)}`,
    mapUrl: c.center_info?.map_location,
  }));
  const primaryCenter = centers[0];

  writePage([], {
    type: "home",
    route: "/",
    hero: homepage.hero,
    features: homepage.features,
    featuredTests: { title: homepage.test_card?.title, cards: featuredCards },
    mostBookedCheckups: homepage.mostBookedCheckups,
    banner: homepage.banner,
    healthMonitoring: { title: "Stay ahead of your health", cards: monitoringCards },
    vitalOrgans: vitalOrgansBlock
      ? {
          title: vitalOrgansBlock.title,
          description: vitalOrgansBlock.description,
          categories: organCategories,
        }
      : null,
    faqs: HOME_FAQS,
    contact: {
      logo: navbar?.content?.logo,
      phone: primaryCenter?.center_info?.phone?.split(",")[0]?.trim(),
      email: primaryCenter?.center_info?.email,
      centers: visitCenters,
    },
  });
  track("/", "home");
}

// ---- manifest ------------------------------------------------------------
manifest.sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(
  path.join(OUT, "_manifest.json"),
  JSON.stringify({ count: manifest.length, pages: manifest }, null, 2),
);

console.log(
  `build-allpages: wrote ${written} page.json files + manifest (${manifest.length} routes)`,
);
