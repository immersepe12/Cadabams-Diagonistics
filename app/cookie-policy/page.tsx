import type { Metadata } from "next";
import { PolicyPageShell } from "@/components/shared/PolicyPageShell";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Cadabam's Diagnostics uses cookies and similar technologies on cadabamsdiagnostics.com.",
  alternates: {
    canonical: "https://cadabamsdiagnostics.com/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <PolicyPageShell
      kind="cookie"
      title="Cookie Policy"
      summary="Cookies are small text files stored on your device. This page explains the ones we use, what they do, and how to control them."
      lastUpdated="2026-05-29"
      sections={[
        {
          id: "what-are-cookies",
          title: "What are cookies?",
          body: (
            <p>
              Cookies are small text files that a website places on your
              device when you visit. They let the site remember you (so you
              don&apos;t have to log in again every time) and help us
              understand how the site is used so we can improve it. Similar
              technologies — like local storage and pixel tags — work in the
              same way and are covered by this policy.
            </p>
          ),
        },
        {
          id: "categories",
          title: "Types of cookies we use",
          body: (
            <>
              <h3>Strictly necessary</h3>
              <p>
                Required for the site to work. They keep you signed in, keep
                items in your cart, remember your selected city, and protect
                checkout from fraud. You cannot turn these off.
              </p>
              <h3>Functional</h3>
              <p>
                Remember preferences such as your language, font-size, and
                whether you have dismissed certain banners. Disabling these
                may make parts of the site less personalised.
              </p>
              <h3>Analytics</h3>
              <p>
                Help us understand which tests are popular, how visitors
                navigate the site, and where there are pain points. The data
                is aggregated and does not identify you personally.
              </p>
              <h3>Marketing</h3>
              <p>
                Allow us to measure the effectiveness of campaigns and show
                you more relevant content on other platforms (such as
                retargeting). We do not share clinical or report data with
                marketing partners.
              </p>
            </>
          ),
        },
        {
          id: "third-party",
          title: "Third-party cookies",
          body: (
            <p>
              Some cookies are set by services we embed — for example,
              Google Maps for centre directions, our payment gateway for
              checkout, and analytics providers. Those cookies are governed
              by the providers&apos; own policies, and we link to them where
              required.
            </p>
          ),
        },
        {
          id: "manage",
          title: "How to manage cookies",
          body: (
            <>
              <p>You can control cookies in two places:</p>
              <ul>
                <li>
                  <strong>The cookie banner</strong> shown when you first
                  visit the site lets you accept or reject non-essential
                  cookies. You can reopen the preference panel from the
                  footer at any time.
                </li>
                <li>
                  <strong>Your browser settings</strong> let you block or
                  delete cookies for specific sites or in general. Helpful
                  guides for{" "}
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chrome
                  </a>
                  ,{" "}
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Firefox
                  </a>
                  , and{" "}
                  <a
                    href="https://support.apple.com/en-in/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Safari
                  </a>{" "}
                  are linked here.
                </li>
              </ul>
              <p>
                Blocking strictly necessary cookies will break parts of the
                site (you may not be able to log in or check out).
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: (
            <p>
              We may update this policy as our use of cookies evolves. The
              &ldquo;Last updated&rdquo; date at the top of the page reflects
              the most recent change. We will surface material changes in our
              cookie banner.
            </p>
          ),
        },
      ]}
    />
  );
}
