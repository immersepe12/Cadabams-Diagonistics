/**
 * Canonical content for the bespoke static pages (about-us is built inline in
 * build-allpages.mjs). Kept here so build-allpages stays readable. Dynamic bits
 * (resolved centres, live test counts) are injected by the generator.
 */

export const managementTeam = {
  hero: {
    badge: "Leadership & Vision",
    title: "Our management team.",
    description:
      "Meet the visionaries leading Cadabam's towards excellence in healthcare — with 30+ years of combined experience steering quality, growth, and patient-first care.",
  },
  stats: [
    { icon: "Calendar", value: "30+", label: "Years of Excellence" },
    { icon: "Users", value: "100+", label: "Team Members" },
    { icon: "Star", value: "95%", label: "Patient Satisfaction" },
    { icon: "Target", value: "5", label: "Specialized Departments" },
  ],
  section: {
    overline: "Meet the leadership",
    title: "The visionaries behind Cadabam's.",
  },
  members: [
    {
      name: "Cadabam M Ramesh",
      role: "Chairman, Cadabam's Group",
      image: "/management/cadabam-m-ramesh.webp",
      description:
        "Mr. Cadabam M. Ramesh, the nucleus of the organization, envisioned Cadabams as a place for treatment and solace for every kind of healthcare concern. Founded with a vision of delivering excellence to patients, he has driven unparalleled service and new outcomes across the Cadabam's Group.",
      achievements: [
        "Steering board priorities",
        "Focus on infrastructure development",
        "Emphasis on quality healthcare",
        "Creating a nurturing work environment",
      ],
    },
    {
      name: "Sudha R. Cadabam",
      role: "Vice Chairperson, Cadabam's Group",
      image: "/management/sudha-r-cadabam.webp",
      description:
        "Mrs. Sudha R. Cadabam oversees the Cadabam's Group's growth and sustainability. With 20 years of expertise, she shapes, structures, and enables smooth, ideal functioning across the organization.",
      achievements: [
        "20+ years of healthcare expertise",
        "Focus on organizational growth",
        "Patient care enhancement",
        "Staff development initiatives",
      ],
    },
    {
      name: "M.K. Saraswathi",
      role: "Vice Chairperson, Cadabam's Group",
      image: "/management/mk-saraswathi.webp",
      description:
        "Ms. M. K. Saraswathi has made an immense contribution to Cadabam's with over two decades of expertise in psychology. With her administrative skills and strategies, she designed the healthcare system to structure operational efficiency.",
      achievements: [
        "20+ years in psychology",
        "Healthcare system design",
        "Operational efficiency",
        "Department supervision",
      ],
    },
    {
      name: "Sandesh Cadabam",
      role: "Director",
      image: "/management/sandesh-cadabam.webp",
      description:
        "Mr. Sandesh R. Cadabam, a promising entrepreneur within the organization, is passionate about providing healthcare to international standards. With an MSc. in International Business & Management from Manchester Business School, UK, he brings innovative strategic methods and modern thinking to the organization.",
      achievements: [
        "International healthcare expertise",
        "Strategic innovation",
        "Team development",
        "Quality healthcare focus",
      ],
    },
    {
      name: "Neha S. Cadabam",
      role: "Executive Director & Psychologist",
      image: "/management/neha-s-cadabam.webp",
      description:
        "Neha Cadabam is a Psychologist at Cadabam's with over 11 years of experience in mental health. She specializes in preventive and promotive mental healthcare, helping individuals improve their well-being and adopt healthier lifestyle changes.",
      achievements: [
        "11+ years in mental health",
        "Certified NLP Practitioner",
        "Multi-lingual expertise",
        "Specialized counseling approaches",
      ],
    },
  ],
  cta: {
    overline: "Get in touch with our management",
    title: "Want to learn more about our leadership?",
    description:
      "For partnerships, press, or governance enquiries, our team is one message away.",
    primary: { label: "Contact us", href: "/contact-us" },
    call: { label: "Talk to us", phone: "+91 99006 64696" },
  },
};

export const clinicalTeam = {
  hero: {
    badge: "Clinical Team",
    title: "Specialists you can trust with your health.",
    description:
      "Our radiologists and clinical experts bring decades of combined experience in fetal medicine, musculoskeletal imaging, and diagnostic radiology — reviewing every report with care.",
  },
  stats: [
    { icon: "Users", value: "__COUNT__", label: "Specialists" },
    { icon: "Award", value: "25+", label: "Years of experience" },
    { icon: "ShieldCheck", value: "NABL", label: "Accredited reporting" },
    { icon: "Stethoscope", value: "6 hrs", label: "Report turnaround" },
  ],
  section: {
    overline: "Meet the team",
    title: "The people behind your reports.",
  },
  doctors: [
    {
      name: "Dr. S Pradeep",
      qualifications: "MBBS, MD, DNB (Radiodiagnosis)",
      position: "Consultant Specialist in Radiology and Fetal Medicine",
      description:
        "Dr. S Pradeep is a registered radiologist with 25 years of immense experience conducting diagnostic and medical imaging procedures to detect diseases. His skills include Fetal TIFFA, ECHO, Neurosonogram, Doppler, CVS, Amniocentesis, and Fetal reductions.",
      image: "/centers/image-1731992821079-356936202.webp",
      education: [
        "MBBS – PSG Coimbatore",
        "MD – JJMMC Davangere",
        "DNB – CMC Vellore",
        "Fetal Intervention – Hong Kong",
        "25 years experience",
      ],
      expertise: [
        "Fetal TIFFA, ECHO, Neurosonogram",
        "Doppler CVS, Amniocentesis",
        "3D TVS, Perianal Sonofistulography",
        "Elastography and Neonatal Scans",
        "Whole body FNAC and Biopsy",
      ],
      achievements: [
        "Gold Medalist",
        "National and International Award Winner",
        "Chaptered in Textbook of Fetal Echo",
        "Performed more than 1000 Amniocentesis",
      ],
    },
    {
      name: "Dr. Divya Cadabam",
      qualifications: "MBBS, MD (Radiodiagnosis)",
      position: "Consultant Specialist in Radiology and Fetal Medicine",
      description:
        "Dr. Divya Cadabam is a reputed doctor in the field of radiodiagnosis. With a fellowship in Fetal Medicine and Advanced Ultrasonography, she specializes in Women's Imaging, Infertility Imaging, and Fetal Interventions.",
      image: "/centers/image-1731992880062-58437075.webp",
      education: [
        "MBBS – M.S. Ramaiah Medical College",
        "MD – Vydehi Institute of Medical Sciences",
        "Fellowship in Fetal Medicine",
        "Advanced Ultrasonography",
      ],
      expertise: [
        "Women's Imaging & Diagnostics",
        "Infertility Imaging",
        "Fetal Medicine",
        "Advanced Ultrasonography",
        "Breast Imaging",
      ],
      achievements: [
        "Expert in Fetal Medicine",
        "Specialized in Women's Health",
        "Advanced Imaging Techniques",
        "Patient-Centered Care",
      ],
    },
    {
      name: "Dr. Shreyas Cadabam",
      qualifications: "MBBS, MD (Radiodiagnosis)",
      position:
        "Consultant Specialist in Radiology and Interventional Musculoskeletal Imaging",
      description:
        "Dr. Shreyas Cadabam is an Interventional Musculoskeletal Radiologist with vast experience. His expertise includes MSK Interventions, Biopsies, FNAC, and specialized imaging.",
      image: "/centers/image-1731996905577-993628054.webp",
      education: [
        "MBBS",
        "MD Radiodiagnosis",
        "Interventional MSK Fellowship",
        "Advanced Training in Interventional Procedures",
      ],
      expertise: [
        "MSK Interventions",
        "Ultrasound Guided Procedures",
        "Joint Injections",
        "Sports Medicine Imaging",
        "Interventional Procedures",
      ],
      achievements: [
        "Specialized in MSK Imaging",
        "Advanced Intervention Techniques",
        "Expert in Sports Medicine",
        "Pioneering Treatment Methods",
      ],
    },
  ],
  cta: {
    overline: "Need a second opinion?",
    title: "Talk to our specialists.",
    description:
      "Book a test or reach out for a report walk-through — our clinical team is here to help.",
    primary: { label: "Book a test", href: "/bangalore/lab-test" },
    call: { label: "Talk to us", phone: "+91 99006 64696" },
  },
};

export const contact = {
  overline: "Contact",
  title: "We're here to help",
  description:
    "Phone, email, or a quick form — pick whatever's easiest. Our team usually replies within an hour during business hours.",
};

export const bangaloreLanding = {
  overline: "Diagnostic services in Bangalore",
  title: "Accurate diagnostics across Bangalore",
  description:
    "Five Cadabam's centres, advanced imaging, certified labs, and home sample collection — designed for the way Bangalore lives.",
  servicesHeading: "Services",
  servicesOverline: "What you can book",
  services: [
    { slug: "lab-test", label: "Lab Tests", icon: "FlaskConical" },
    { slug: "xray-scan", label: "X-Ray scans", icon: "Activity" },
    { slug: "mri-scan", label: "MRI scans", icon: "Activity" },
    { slug: "ct-scan", label: "CT scans", icon: "Activity" },
    { slug: "ultrasound-scan", label: "Ultrasound scans", icon: "Activity" },
    { slug: "pregnancy-scan", label: "Pregnancy scans", icon: "Activity" },
    { slug: "msk-scan", label: "MSK scans", icon: "Activity" },
  ],
};

export const login = {
  overline: "Welcome back",
  heading: "Sign in to your account",
  subheading:
    "View reports, track home collections, and manage your bookings from one place.",
  footerText: "New to Cadabam's?",
  footerLinkLabel: "Create an account",
  footerLinkHref: "/signup",
};

export const signup = {
  overline: "Get started",
  heading: "Create your account",
  subheading:
    "Book tests, get reports in hours, and keep your family's health records in one secure place.",
  footerText: "Already have an account?",
  footerLinkLabel: "Sign in instead",
  footerLinkHref: "/login",
};

export const cart = {
  title: "Your cart",
  whatsappNumber: "919538593355",
  helpPhone: "+91 99006 64696",
  summary: {
    title: "Order summary",
    proceedLabel: "Proceed to book",
    trust: [
      { icon: "Clock", text: "Reports in 6 hours on most tests" },
      { icon: "HeartPulse", text: "Free home sample collection" },
      { icon: "ShieldCheck", text: "NABL Accredited labs" },
    ],
  },
  empty: {
    title: "Your cart is empty",
    description:
      "Browse our lab tests or radiology scans to add a test to your cart, or call us directly and we'll book it for you.",
    buttons: [
      { label: "Browse lab tests", href: "/bangalore/lab-test" },
      { label: "Browse radiology", href: "/bangalore/xray-scan" },
    ],
    helpText: "Prefer to talk to a person?",
  },
};

const LAST_UPDATED = "2026-05-29";

export const policies = {
  "terms-of-use": {
    kind: "terms",
    title: "Terms of Use",
    summary:
      "These terms govern your use of cadabamsdiagnostics.com and any services you book through it. By using the site, you agree to be bound by them.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: "acceptance",
        title: "Acceptance of these terms",
        body: "By accessing or using cadabamsdiagnostics.com, the Cadabam's Diagnostics mobile experience, or any service we deliver through them, you agree to be bound by these Terms of Use and our [Privacy Policy](/privacy-policy). If you do not agree, please do not use the site.\n\nWe may update these terms from time to time. Material changes will be highlighted at the top of this page. Continuing to use the site after a change means you accept the updated terms.",
      },
      {
        id: "use-of-site",
        title: "Use of the website",
        body: "Content on this site — including test descriptions, sample preparation guides, blog articles, and health insights — is provided for general information only and is **not a substitute for professional medical advice**. Always consult a qualified clinician for diagnosis and treatment decisions.\n\nYou agree not to:\n\n- Use the site for any unlawful, fraudulent, or harmful purpose.\n- Attempt to gain unauthorised access to any portion of the site, our servers, or another user's account.\n- Reproduce, scrape, or republish content without our prior written permission.\n- Interfere with the security, availability, or integrity of the site.",
      },
      {
        id: "accounts",
        title: "Accounts and bookings",
        body: "Some features — including booking tests, viewing reports, and managing family profiles — require an account. You are responsible for keeping your login credentials confidential and for all activity that takes place under your account.\n\nBookings are subject to availability and to confirmation by our team. Prices shown on the site are in INR and inclusive of applicable taxes unless stated otherwise. Prices may change without notice; the price confirmed at checkout is the price that applies to your booking.",
      },
      {
        id: "payments-refunds",
        title: "Payments, cancellations and refunds",
        body: "Payment for a booking is collected at checkout or at the time of sample collection, depending on the option you choose. Cancellations and refunds are handled under our [Refund Policy](/refund-policy).\n\nIf your booking cannot be fulfilled for any reason attributable to us, we will offer a reschedule or a full refund to the original payment method.",
      },
      {
        id: "intellectual-property",
        title: "Intellectual property",
        body: "All content on this site — including text, images, logos, clinical-content templates, photography, software, and reports — is the property of Cadabam's Diagnostics or our licensors and is protected by copyright and trademark laws.\n\nYou may not reproduce, distribute, modify, or create derivative works of any part of this site without our prior written consent. Personal, non-commercial use within the normal functioning of the site (viewing pages, downloading your own reports) is permitted.",
      },
      {
        id: "third-parties",
        title: "Third-party links and services",
        body: "The site may contain links to third-party websites or embed services we do not control (such as maps, payment gateways, or analytics tools). We are not responsible for their content, privacy practices, or availability. Your use of those services is governed by their own terms.",
      },
      {
        id: "liability",
        title: "Disclaimers and limitation of liability",
        body: "The site is provided on an **as-is** and **as-available** basis. To the maximum extent permitted by law, Cadabam's Diagnostics disclaims all warranties, express or implied, including any warranty of merchantability, fitness for a particular purpose, or non-infringement.\n\nWe will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or goodwill, arising out of or in connection with your use of the site, even if we have been advised of the possibility of such damages.",
      },
      {
        id: "governing-law",
        title: "Governing law and jurisdiction",
        body: "These Terms of Use are governed by the laws of India. Any dispute arising out of or in connection with the site or these terms will be subject to the exclusive jurisdiction of the courts at Bangalore, Karnataka.",
      },
    ],
  },
  "privacy-policy": {
    kind: "privacy",
    title: "Privacy Policy",
    summary:
      "Your health information is sensitive. Here's exactly what we collect, why, how we protect it, and the controls you have over it.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: "what-we-collect",
        title: "What we collect",
        body: "We collect only what we need to deliver safe diagnostic care:\n\n- **Identifying details** you provide — name, age, gender, phone number, email, and address used for sample collection and report delivery.\n- **Booking data** — tests and scans you book, centre and time chosen, payment receipts, and prescriptions you upload.\n- **Clinical information** generated during your tests — sample readings, images, and physician interpretations that make up your report.\n- **Site usage** — anonymised analytics such as pages viewed, device type, and approximate location, used to improve the site experience.",
      },
      {
        id: "how-we-use",
        title: "How we use your information",
        body: "We use your information to:\n\n- Schedule appointments, coordinate home sample collection, and run your tests.\n- Deliver reports to you via app, email, or WhatsApp and notify you when results are ready.\n- Contact you about your bookings — confirmations, reminders, rescheduling, or post-test follow-ups.\n- Improve our services and content, troubleshoot issues, and detect fraud or misuse.\n- Meet legal, regulatory, and accreditation obligations (including NABL audit requirements).\n\n**We do not sell your personal or health data** to advertisers or data brokers.",
      },
      {
        id: "sharing",
        title: "Who we share it with",
        body: "Your data is shared only when necessary, and only with:\n\n- **Your referring physician**, if you have asked us to send the report to them.\n- **Our clinical and operations teams**, on a role-based, need-to-know basis to complete your booking.\n- **Trusted service providers** — payment gateways, sample logistics, secure cloud hosting, and SMS / email delivery partners — under contract to protect your data and use it only for the service we engage them for.\n- **Regulators or courts**, if we are legally required to disclose specific information.",
      },
      {
        id: "protection",
        title: "How we protect it",
        body: "We use industry-standard safeguards designed for health data:\n\n- Encryption in transit (TLS) and at rest.\n- Role-based access for our clinical team, with the minimum privileges needed for each role.\n- Audit logs on every record access, reviewed regularly.\n- Physical reports stored in secure, access-controlled rooms at our centres.\n- Periodic security reviews, vulnerability scans, and staff training on data handling.\n\nNo system is perfectly secure. If we ever become aware of a breach that affects your data, we will notify you promptly in line with applicable law.",
      },
      {
        id: "retention",
        title: "How long we keep it",
        body: "Clinical records are retained for the periods required under applicable medical-records regulations (typically several years after the last interaction). Non-clinical data, such as marketing preferences, is kept only while it is needed for the purpose we collected it. You can ask us to delete or anonymise data we are not required to keep.",
      },
      {
        id: "your-rights",
        title: "Your rights",
        body: "At any time you can:\n\n- Request a copy of the records we hold about you.\n- Correct inaccurate or outdated details.\n- Withdraw consent for non-clinical communication such as marketing emails or wellness tips.\n- Ask us to delete data we are not legally required to keep.\n\nEmail [info@cadabamsdiagnostics.com](mailto:info@cadabamsdiagnostics.com) with the subject line \"Privacy request\" and we will respond within 30 days.",
      },
      {
        id: "children",
        title: "Children's information",
        body: "If a child is the patient, we collect their clinical details under the consent of a parent or legal guardian. We do not market our services to children directly.",
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: "We will update this policy when our practices change or when required by law. The \"Last updated\" date at the top of the page reflects the most recent revision. Material changes will be highlighted at the top.",
      },
    ],
  },
  "cookie-policy": {
    kind: "cookie",
    title: "Cookie Policy",
    summary:
      "Cookies are small text files stored on your device. This page explains the ones we use, what they do, and how to control them.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: "what-are-cookies",
        title: "What are cookies?",
        body: "Cookies are small text files that a website places on your device when you visit. They let the site remember you (so you don't have to log in again every time) and help us understand how the site is used so we can improve it. Similar technologies — like local storage and pixel tags — work in the same way and are covered by this policy.",
      },
      {
        id: "categories",
        title: "Types of cookies we use",
        body: "### Strictly necessary\n\nRequired for the site to work. They keep you signed in, keep items in your cart, remember your selected city, and protect checkout from fraud. You cannot turn these off.\n\n### Functional\n\nRemember preferences such as your language, font-size, and whether you have dismissed certain banners. Disabling these may make parts of the site less personalised.\n\n### Analytics\n\nHelp us understand which tests are popular, how visitors navigate the site, and where there are pain points. The data is aggregated and does not identify you personally.\n\n### Marketing\n\nAllow us to measure the effectiveness of campaigns and show you more relevant content on other platforms (such as retargeting). We do not share clinical or report data with marketing partners.",
      },
      {
        id: "third-party",
        title: "Third-party cookies",
        body: "Some cookies are set by services we embed — for example, Google Maps for centre directions, our payment gateway for checkout, and analytics providers. Those cookies are governed by the providers' own policies, and we link to them where required.",
      },
      {
        id: "manage",
        title: "How to manage cookies",
        body: "You can control cookies in two places:\n\n- **The cookie banner** shown when you first visit the site lets you accept or reject non-essential cookies. You can reopen the preference panel from the footer at any time.\n- **Your browser settings** let you block or delete cookies for specific sites or in general. Helpful guides for [Chrome](https://support.google.com/chrome/answer/95647), [Firefox](https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer), and [Safari](https://support.apple.com/en-in/guide/safari/sfri11471/mac) are linked here.\n\nBlocking strictly necessary cookies will break parts of the site (you may not be able to log in or check out).",
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: "We may update this policy as our use of cookies evolves. The \"Last updated\" date at the top of the page reflects the most recent change. We will surface material changes in our cookie banner.",
      },
    ],
  },
  "refund-policy": {
    kind: "refund",
    title: "Refund & Cancellation Policy",
    summary:
      "Plans change. Here's exactly how cancellations, rescheduling, and refunds work for bookings made with Cadabam's Diagnostics.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: "cancellations",
        title: "Cancellations",
        body: "You can cancel any test, scan, or checkup booking and receive a refund based on when you cancel:\n\n- **More than 2 hours before** the scheduled appointment — full refund to the original payment method.\n- **Within 2 hours of** the scheduled appointment — no refund (the slot can no longer be reassigned).\n- **No-shows** — no refund. The booking is treated as a completed visit.\n\nTo cancel, log in to your account, call [+91 99006 64696](tel:+919900664696), or reply to your booking confirmation.",
      },
      {
        id: "rescheduling",
        title: "Rescheduling",
        body: "Rescheduling is **free up to 1 hour before** the appointment. After that we may need to issue a small operational fee depending on the test type — our team will tell you the exact amount when you call. Rescheduled bookings keep the original price you paid.",
      },
      {
        id: "refund-timelines",
        title: "Refund timelines",
        body: "Refunds are processed back to the original payment method:\n\n- **UPI** — typically within 24 hours.\n- **Cards** — 3–5 business days.\n- **Net banking and wallets** — 5–7 business days.\n\nIf the original payment method is no longer available (for example, a closed card), we will reach out to arrange a bank transfer.",
      },
      {
        id: "service-failure",
        title: "If we cannot deliver the service",
        body: "If a booking cannot be fulfilled for any reason attributable to us — phlebotomist no-show, sample spoilage, equipment downtime at the centre — we will offer a no-cost reschedule or a full refund, whichever you prefer. We'll also let you know the moment the issue is identified so you aren't kept waiting.",
      },
      {
        id: "result-disputes",
        title: "Test-result disputes and retests",
        body: "If you believe a result is incorrect, contact us within **7 days of receiving the report**. We will re-process the sample, or collect a fresh sample if needed, at **no additional cost**. Refunds are not issued for tests whose results are clinically valid — even if the result is unfavourable — because the test itself was performed correctly.",
      },
      {
        id: "package-refunds",
        title: "Packages and multi-test refunds",
        body: "For health-checkup packages and bundled tests, refunds are calculated on the package value, not the individual test list price. Tests that have already been performed within a partially completed package are deducted at their standalone price before refunding the balance.",
      },
      {
        id: "non-refundable",
        title: "What is non-refundable",
        body: "- Home-collection convenience fees once the phlebotomist has arrived at your address.\n- Reports already generated and shared with you or your physician.\n- Cancellations and no-shows within the cut-offs above.",
      },
      {
        id: "contact",
        title: "Need to talk to us?",
        body: "Call [+91 99006 64696](tel:+919900664696) or email [info@cadabamsdiagnostics.com](mailto:info@cadabamsdiagnostics.com) with your booking ID. Most refund requests are resolved within one working day.",
      },
    ],
  },
  legal: {
    kind: "legal",
    title: "Legal Information",
    summary:
      "Quick links to our policies, plus important disclaimers, accreditation details, and how to reach our legal team.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        id: "medical-disclaimer",
        title: "Medical disclaimer",
        body: "Content on this site — test descriptions, sample-preparation guides, health blogs, and report explainers — is for general awareness about the diagnostic services we offer. It is **not a substitute for professional medical advice, diagnosis, or treatment**.\n\nAlways consult a qualified clinician for diagnosis, treatment, or interpretation of your results. Do not delay seeking medical advice based on something you read here.",
      },
      {
        id: "accreditation",
        title: "Accreditation and quality",
        body: "Cadabam's Diagnostics laboratories are accredited by the **National Accreditation Board for Testing and Calibration Laboratories (NABL)**. Our clinical processes follow standard operating procedures aligned with ISO 15189 for medical laboratories.\n\nInternal quality controls, external proficiency testing, periodic equipment calibration, and regular staff training form the backbone of how we keep results reliable.",
      },
      {
        id: "entity",
        title: "Entity details",
        body: "Cadabam's Diagnostics is operated by **Cadabams Health Care Pvt. Ltd.**, with its registered office in Bengaluru, Karnataka, India.\n\nFor corporate, partnership, or media enquiries, write to [info@cadabamsdiagnostics.com](mailto:info@cadabamsdiagnostics.com). For service-related queries, please use the [Contact us](/contact-us) page.",
      },
      {
        id: "intellectual-property",
        title: "Intellectual property",
        body: "The Cadabam's Diagnostics name, logo, marks, branding, and all original content on this site are the property of Cadabams Health Care Pvt. Ltd. or its licensors. You may not reproduce, redistribute, or create derivative works of any part of this site without prior written consent, except as permitted by our [Terms of Use](/terms-of-use).",
      },
      {
        id: "grievance",
        title: "Grievance redressal",
        body: "If you believe a service, report, or interaction with us has fallen short of what you expected, please raise it with our Grievance Officer.\n\n- **Email:** [info@cadabamsdiagnostics.com](mailto:info@cadabamsdiagnostics.com) with the subject line \"Grievance\".\n- **Phone:** [+91 99006 64696](tel:+919900664696) (Mon–Sat, 9 am – 6 pm).\n- Include your booking ID, the centre or service involved, and a brief description of the concern.\n\nWe aim to acknowledge every grievance within 2 working days and resolve it within 15 working days.",
      },
      {
        id: "jurisdiction",
        title: "Governing law and jurisdiction",
        body: "Use of this site and any services booked through it are governed by the laws of India. Any dispute arising in connection with the site or our services is subject to the exclusive jurisdiction of the competent courts at Bangalore, Karnataka.",
      },
      {
        id: "report-issue",
        title: "Report a security or content issue",
        body: "If you believe you have found a security vulnerability or inaccurate medical content on the site, email [info@cadabamsdiagnostics.com](mailto:info@cadabamsdiagnostics.com) with the subject \"Security report\" or \"Content correction\". Please don't share details publicly until we have had a chance to address them.",
      },
    ],
  },
};
