import {
  CalendarDays,
  Database,
  Eye,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  Settings2,
  Share2,
  ShieldCheck,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type PrivacySection = {
  id: string;
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  points?: string[];
};

const sections: PrivacySection[] = [
  {
    id: "information",
    title: "Information the platform handles",
    icon: Database,
    paragraphs: [
      "RestoManager handles information that is needed to provide account access, restaurant management, public discovery, and ordering features.",
    ],
    points: [
      "Account details such as name, email address, phone number, role, and authentication information.",
      "Customer information such as saved delivery addresses and order history.",
      "Restaurant details such as business information, contact details, opening hours, menus, branding, and verification documents.",
      "Operational information such as order status updates, timestamps, and security or diagnostic records generated when the platform is used.",
    ],
  },
  {
    id: "use",
    title: "How information is used",
    icon: Settings2,
    paragraphs: [
      "Information is used only for the platform’s current workflows: creating and protecting accounts, reviewing restaurant submissions, publishing approved listings, managing menus, processing orders, and maintaining platform reliability.",
    ],
    points: [
      "Provide the correct experience for customers, owners, and administrators.",
      "Display approved restaurant and menu information to public visitors.",
      "Connect customer orders with the selected restaurant.",
      "Prevent misuse, investigate errors, and protect platform access.",
    ],
  },
  {
    id: "visibility",
    title: "What becomes public",
    icon: Eye,
    paragraphs: [
      "Approved restaurant profiles may display the restaurant name, description, branding, location details, contact information, cuisine types, opening hours, menu categories, menu items, prices, and availability.",
      "Private account details, customer addresses, order records, and restaurant verification documents are not part of the public restaurant listing. Access to non-public information is limited by platform role and operational need.",
    ],
  },
  {
    id: "sharing",
    title: "Service providers and disclosures",
    icon: Share2,
    paragraphs: [
      "RestoManager relies on infrastructure and service providers for functions such as authentication, database operations, and file storage. These providers process information only as needed to deliver those platform functions.",
      "Information may also be disclosed when required by law or when reasonably necessary to protect users, restaurants, platform security, or legal rights.",
    ],
  },
  {
    id: "choices",
    title: "Your choices and responsibilities",
    icon: UserRoundCog,
    paragraphs: [
      "Customers and restaurant owners can review and update information available in their account or dashboard. Some records may need administrator assistance when they are tied to identity, restaurant verification, security, or completed orders.",
    ],
    points: [
      "Keep account and restaurant information accurate.",
      "Review saved addresses before placing an order.",
      "Use the Support page for guidance when a change is not available in your account.",
    ],
  },
  {
    id: "security",
    title: "Security and retention",
    icon: KeyRound,
    paragraphs: [
      "RestoManager uses role-based access and platform safeguards intended to protect personal and business information. No online system can guarantee absolute security, so users should also protect their credentials and report suspected unauthorized access.",
      "Information is retained for as long as it is needed to operate the platform, maintain account and order records, resolve security or operational issues, and meet applicable legal obligations.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <section className="relative isolate border-b border-border px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
        <div
          aria-hidden="true"
          className="absolute -left-28 -top-44 -z-10 size-112 rounded-full bg-secondary/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 top-0 -z-10 size-112 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Privacy and data
          </div>

          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                A straightforward explanation of the information RestoManager
                handles and how it supports the platform’s current features.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <CalendarDays className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Last updated
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    July 13, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8 lg:py-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-label="Privacy policy sections"
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              On this page
            </p>
            <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/35 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Privacy at a glance
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Public restaurant information is separated from private
                  account, verification, address, and order information through
                  role-based platform access.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {sections.map(({ id, title, icon: Icon, paragraphs, points }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24 p-6 sm:p-8"
                aria-labelledby={`${id}-title`}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2
                      id={`${id}-title`}
                      className="text-xl font-bold tracking-tight text-foreground"
                    >
                      {title}
                    </h2>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                      {paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {points ? (
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        {points.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <section className="border-t border-border bg-secondary/45 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
              <FileCheck2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Questions about your information?
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Review the available support guidance or the terms governing
                use of the platform.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/terms"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-background px-5 text-sm font-semibold text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Terms of service
            </Link>
            <Link
              to="/support"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Visit support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
