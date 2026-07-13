import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  ListChecks,
  LogIn,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type QuickLink = {
  title: string;
  description: string;
  to: string;
  label: string;
  icon: LucideIcon;
};

type HelpItem = {
  question: string;
  answer: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Find a restaurant",
    description: "Browse approved restaurants and view their current menus.",
    to: "/restaurants",
    label: "Browse restaurants",
    icon: Search,
  },
  {
    title: "Access your account",
    description: "Sign in to view the workspace available for your role.",
    to: "/login",
    label: "Go to login",
    icon: LogIn,
  },
  {
    title: "Join as a restaurant",
    description: "Start the restaurant registration and review process.",
    to: "/restaurant/register",
    label: "Register a restaurant",
    icon: Store,
  },
];

const customerHelp: HelpItem[] = [
  {
    question: "Why can’t I add an item to my cart?",
    answer:
      "An item cannot be added when it is unavailable or when the restaurant is closed. Refresh the restaurant menu to confirm its current status.",
  },
  {
    question: "Why did my previous cart disappear?",
    answer:
      "A cart can contain items from one restaurant at a time. Adding an item from another restaurant starts a cart for the newly selected restaurant.",
  },
  {
    question: "Where can I follow an order?",
    answer:
      "Sign in with the customer account used at checkout and open Orders. Current orders show their latest platform status, while completed or cancelled orders appear in order history.",
  },
  {
    question: "How do I correct a delivery address?",
    answer:
      "Open Addresses from your customer account to add, edit, or choose an address before checkout. Review the selected address carefully before submitting an order.",
  },
];

const ownerHelp: HelpItem[] = [
  {
    question: "Why is my restaurant not public yet?",
    answer:
      "New restaurant submissions are reviewed before publication. Sign in to view the current application status and any decision information available to your account.",
  },
  {
    question: "When can I manage my profile and menu?",
    answer:
      "Approved restaurant owners can use the owner workspace to update restaurant details, opening hours, categories, menu items, prices, and availability.",
  },
  {
    question: "How should I handle incoming orders?",
    answer:
      "Use the Orders area in the owner workspace to review order details and move orders through the statuses supported by the kitchen workflow.",
  },
  {
    question: "What should I do after a rejection or suspension?",
    answer:
      "Review the status information shown after sign-in. If further clarification is needed, contact the platform administrator through the same administrative channel used for restaurant onboarding.",
  },
];

function HelpList({
  title,
  description,
  icon: Icon,
  items,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  items: HelpItem[];
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/35 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <article key={item.question} className="p-6 sm:p-7">
            <h3 className="font-semibold leading-6 text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Support() {
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
            <LifeBuoy className="size-3.5" aria-hidden="true" />
            Help center
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
            RestoManager Support
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Static guidance for browsing restaurants, managing an account,
            placing orders, and operating a restaurant on the platform.
          </p>

          <div className="mt-9 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {[
              [BadgeCheck, "Approved restaurant listings"],
              [ShoppingBag, "Customer order guidance"],
              [ShieldCheck, "Owner and account help"],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as LucideIcon;
              return (
                <div
                  key={label as string}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-3.5 py-2 shadow-sm backdrop-blur-sm"
                >
                  <ItemIcon className="size-4 text-primary" aria-hidden="true" />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section aria-labelledby="quick-actions-title">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Start here
            </p>
            <h2
              id="quick-actions-title"
              className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              Go directly to the right place
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {quickLinks.map(({ title, description, to, label, icon: Icon }) => (
              <article
                key={title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <Link
                  to={to}
                  className="group mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-16"
          aria-labelledby="common-questions-title"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Common questions
            </p>
            <h2
              id="common-questions-title"
              className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              Help for customers and restaurant owners
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              All guidance is shown directly on this page—there are no hidden
              forms, automated assistants, or simulated support tools.
            </p>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            <HelpList
              title="Customer guidance"
              description="Browsing, carts, orders, and delivery addresses."
              icon={UserRound}
              items={customerHelp}
            />
            <HelpList
              title="Restaurant-owner guidance"
              description="Verification, profile management, menus, and orders."
              icon={UtensilsCrossed}
              items={ownerHelp}
            />
          </div>
        </section>

        <section
          className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]"
          aria-labelledby="contact-guidance-title"
        >
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HelpCircle className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="contact-guidance-title"
                  className="text-xl font-bold tracking-tight text-foreground"
                >
                  Contact and escalation guidance
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  RestoManager does not currently provide a public ticket form,
                  live chat, or published support mailbox. Use the appropriate
                  existing contact channel below.
                </p>
              </div>
            </div>

            <dl className="mt-7 divide-y divide-border border-y border-border">
              <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-5">
                <dt className="font-semibold text-foreground">
                  Account access
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  Contact the platform administrator responsible for your
                  account and include the email address used to sign in.
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-5">
                <dt className="font-semibold text-foreground">
                  Restaurant review
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  Use the administrative contact channel provided during
                  restaurant onboarding or review the status shown after login.
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-5">
                <dt className="font-semibold text-foreground">Order issue</dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  Keep the order code and current status available when
                  contacting the responsible restaurant or platform
                  administrator.
                </dd>
              </div>
            </dl>
          </div>

          <aside className="rounded-3xl border border-primary/15 bg-secondary/55 p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
              <CircleAlert className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-bold text-foreground">
              Before requesting help
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {[
                "Note the page and action that caused the issue.",
                "Keep relevant restaurant or order identifiers available.",
                "Do not share passwords or authentication codes.",
                "For suspected unauthorized access, stop using the affected account and notify the administrator.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <ListChecks
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-16 flex flex-col gap-5 rounded-3xl bg-foreground p-7 text-background sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-background">
                Ready to continue?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-background/60">
                Sign in to access your account, orders, restaurant status, or
                owner workspace.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          >
            Sign in
          </Link>
        </section>
      </main>
    </div>
  );
}
