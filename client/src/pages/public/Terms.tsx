import {
  Ban,
  CalendarDays,
  FileText,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type TermsSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  points?: string[];
};

const sections: TermsSection[] = [
  {
    id: "agreement",
    title: "Using RestoManager",
    icon: UserRoundCheck,
    paragraphs: [
      "These terms apply when you browse RestoManager, create an account, submit a restaurant, manage a restaurant profile, or place an order through the platform.",
      "By using RestoManager, you agree to follow these terms and all laws that apply to your use of the platform. If you do not agree, please do not use the service.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts and access",
    icon: ShieldCheck,
    paragraphs: [
      "You are responsible for providing accurate account information and protecting your sign-in credentials. Activity performed through your account is treated as activity authorized by you unless you report unauthorized access.",
    ],
    points: [
      "Use the role and account assigned to you; do not impersonate another person or business.",
      "Keep account and restaurant information current.",
      "Notify the platform administrator if you believe your account has been compromised.",
    ],
  },
  {
    id: "restaurants",
    title: "Restaurant listings and owner content",
    icon: Store,
    paragraphs: [
      "Restaurant owners are responsible for the accuracy of their business details, opening hours, menus, prices, availability, images, and verification documents. Restaurant submissions may be reviewed before they are made public.",
      "By uploading content, owners confirm that they have permission to use it and allow RestoManager to display it as needed to operate the restaurant listing and menu.",
    ],
  },
  {
    id: "orders",
    title: "Orders and availability",
    icon: ShoppingBag,
    paragraphs: [
      "Customers can submit orders using the menu information available at the time of checkout. Restaurants remain responsible for accepting, preparing, updating, and completing those orders.",
    ],
    points: [
      "Menu items, prices, and availability may change before an order is submitted.",
      "An order is not guaranteed until it has been received and handled by the restaurant.",
      "Order concerns should be raised with the relevant restaurant or the platform administrator using the available support guidance.",
    ],
  },
  {
    id: "conduct",
    title: "Acceptable use",
    icon: Ban,
    paragraphs: [
      "RestoManager must not be used to disrupt the platform, access another user’s account, submit false information, place fraudulent orders, scrape protected data, upload unlawful content, or attempt to bypass security and access controls.",
      "We may restrict access or remove content when necessary to protect users, restaurants, platform integrity, or legal compliance.",
    ],
  },
  {
    id: "availability",
    title: "Platform availability and changes",
    icon: Scale,
    paragraphs: [
      "RestoManager may change as features, restaurant information, and operational requirements evolve. Access can occasionally be interrupted for maintenance, security, or circumstances outside the platform’s control.",
      "To the extent permitted by applicable law, RestoManager is provided as available. Nothing in these terms excludes rights that cannot legally be limited.",
    ],
  },
];

export default function Terms() {
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
            <FileText className="size-3.5" aria-hidden="true" />
            Platform terms
          </div>

          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                Terms of Service
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Clear rules for customers, restaurant owners, and administrators
                using the RestoManager platform.
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
            aria-label="Terms sections"
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
                <Scale className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  A practical overview
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These terms describe the responsibilities attached to the
                  platform’s current customer, restaurant-owner, and
                  administrator experiences.
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
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Need help understanding the platform?
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Review the static support guidance or read how platform data is
              handled.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/privacy"
              className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-background px-5 text-sm font-semibold text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Privacy policy
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
