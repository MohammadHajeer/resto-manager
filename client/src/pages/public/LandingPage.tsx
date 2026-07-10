import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChefHat,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  LayoutDashboard,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  UtensilsCrossed,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Role = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};

const roles: Role[] = [
  {
    eyebrow: "For customers",
    title: "Discover restaurants with confidence",
    description:
      "Browse approved restaurants, filter by cuisine and city, and explore organized digital menus before choosing where to eat.",
    points: [
      "Search and smart filters",
      "Clear restaurant details",
      "Menus grouped by category",
    ],
    icon: Search,
  },
  {
    eyebrow: "For restaurant owners",
    title: "Build and manage your digital presence",
    description:
      "Register your restaurant, complete its profile, organize categories, and keep menu items accurate from one owner workspace.",
    points: [
      "Guided registration",
      "Profile and brand management",
      "Category and menu controls",
    ],
    icon: Store,
  },
  {
    eyebrow: "For administrators",
    title: "Protect the quality of the platform",
    description:
      "Review submitted restaurants and their verification details before approving, rejecting, or suspending access.",
    points: [
      "Central review workflow",
      "Clear status decisions",
      "Role-protected access",
    ],
    icon: ShieldCheck,
  },
];

const journey = [
  {
    step: "01",
    title: "Restaurant applies",
    description:
      "The owner submits restaurant, contact, branding, and verification details.",
    icon: ClipboardCheck,
  },
  {
    step: "02",
    title: "Admin reviews",
    description:
      "The submission is reviewed before the restaurant becomes publicly visible.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Owner manages",
    description:
      "Approved owners update profiles, opening hours, categories, and menu items.",
    icon: LayoutDashboard,
  },
  {
    step: "04",
    title: "Customers discover",
    description:
      "Customers browse trusted restaurants and explore their menus in one place.",
    icon: UsersRound,
  },
];

function DotPattern({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid grid-cols-6 gap-2 opacity-55 ${className}`}
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <span key={index} className="size-1 rounded-full bg-primary/55" />
      ))}
    </div>
  );
}

function BrowserHeader({ label }: { label: string }) {
  return (
    <div className="flex h-9 items-center gap-2 border-b border-border/80 bg-muted/50 px-4">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="size-2 rounded-full bg-red-300" />
        <span className="size-2 rounded-full bg-amber-300" />
        <span className="size-2 rounded-full bg-primary/45" />
      </div>
      <div className="mx-auto flex h-5 min-w-32 items-center justify-center rounded-full border border-border bg-white px-4 text-[8px] font-semibold text-muted-foreground">
        {label}
      </div>
      <div className="w-7" />
    </div>
  );
}

function PublicDiscoveryMockup() {
  const restaurants = [
    { name: "Cedar Table", cuisine: "Lebanese", time: "25–35 min" },
    { name: "Pasta Lane", cuisine: "Italian", time: "30–40 min" },
    { name: "Tokyo Bowl", cuisine: "Japanese", time: "20–30 min" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.32)]">
      <BrowserHeader label="restomanager.app/restaurants" />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-primary">
              RestoManager
            </div>
            <div className="mt-1 text-sm font-extrabold tracking-tight text-foreground sm:text-base">
              Discover great food near you
            </div>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <ShoppingBag size={14} />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-2 shadow-sm">
          <Search size={13} className="text-muted-foreground" />
          <span className="flex-1 text-[9px] text-muted-foreground">
            Search restaurants or cuisines...
          </span>
          <span className="rounded-lg bg-primary px-3 py-1.5 text-[8px] font-bold text-primary-foreground">
            Search
          </span>
        </div>

        <div className="flex gap-2 overflow-hidden">
          {["All", "Lebanese", "Italian", "Burgers"].map((item, index) => (
            <span
              key={item}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[8px] font-semibold ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-white text-muted-foreground"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.name}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div
                className={`h-14 sm:h-20 ${
                  index === 0
                    ? "bg-[linear-gradient(135deg,#d9f5ed,#8fd8c5)]"
                    : index === 1
                      ? "bg-[linear-gradient(135deg,#f8e8cf,#dfb979)]"
                      : "bg-[linear-gradient(135deg,#e8eef7,#9fb4d1)]"
                }`}
              >
                <div className="flex h-full items-end justify-end p-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white/85 text-primary shadow-sm backdrop-blur-sm">
                    <UtensilsCrossed size={13} />
                  </div>
                </div>
              </div>
              <div className="space-y-1 p-2">
                <div className="truncate text-[8px] font-bold text-foreground sm:text-[9px]">
                  {restaurant.name}
                </div>
                <div className="truncate text-[7px] text-muted-foreground">
                  {restaurant.cuisine}
                </div>
                <div className="flex items-center gap-1 text-[6px] font-medium text-muted-foreground sm:text-[7px]">
                  <Clock3 size={8} />
                  {restaurant.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnerDashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_55px_-24px_rgba(15,23,42,0.35)]">
      <BrowserHeader label="Owner workspace" />
      <div className="flex min-h-48">
        <aside className="hidden w-24 shrink-0 bg-[#005f4c] p-3 text-white sm:block">
          <div className="mb-5 text-[8px] font-extrabold">RestoManager</div>
          <div className="space-y-2 text-[7px] text-white/75">
            {[
              [LayoutDashboard, "Overview"],
              [Store, "Profile"],
              [UtensilsCrossed, "Menu"],
            ].map(([Icon, label]) => {
              const SidebarIcon = Icon as LucideIcon;
              return (
                <div
                  key={label as string}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 first:bg-white/15 first:text-white"
                >
                  <SidebarIcon size={9} />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[8px] text-muted-foreground">
                Welcome back
              </div>
              <div className="text-[11px] font-extrabold text-foreground">
                Restaurant profile
              </div>
            </div>
            <span className="rounded-full bg-secondary px-2 py-1 text-[7px] font-bold text-secondary-foreground">
              Approved
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["Categories", "06"],
              ["Menu items", "24"],
              ["Profile", "92%"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-card p-2.5"
              >
                <div className="text-[6px] text-muted-foreground">{label}</div>
                <div className="mt-1 text-[11px] font-extrabold text-foreground">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-muted/45 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[8px] font-bold text-foreground">
                Profile completeness
              </div>
              <div className="text-[7px] font-bold text-primary">92%</div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[92%] rounded-full bg-primary" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-8 rounded-lg border border-border bg-white" />
              <div className="h-8 rounded-lg border border-border bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminReviewMockup() {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white/95 p-4 shadow-[0_18px_50px_-25px_rgba(0,138,102,0.48)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <BadgeCheck size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-[10px] font-extrabold text-foreground">
              New restaurant application
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[6px] font-bold text-amber-700">
              Pending
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[7px] text-muted-foreground">
            <MapPin size={8} /> Beirut, Lebanon
          </div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md bg-primary px-2.5 py-1.5 text-[7px] font-bold text-primary-foreground">
              Review
            </span>
            <span className="rounded-md border border-border px-2.5 py-1.5 text-[7px] font-bold text-muted-foreground">
              View details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <section
        id="home"
        className="relative isolate overflow-hidden px-4 pb-24 pt-14 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20"
      >
        <div
          aria-hidden="true"
          className="absolute -left-28 -top-36 -z-10 size-112 rounded-full bg-secondary/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 top-8 -z-10 size-136 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 -z-10 h-44 w-[42%] rounded-br-[48%] border-b border-r border-primary/25 bg-white/[0.55]"
        />
        <DotPattern className="absolute left-8 top-9 hidden sm:grid" />
        <DotPattern className="absolute bottom-12 right-8 hidden lg:grid" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <div className="relative z-10 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
              <Sparkles size={14} />
              One platform. Three connected experiences.
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
              Discover, manage, and grow with{" "}
              <span className="text-primary">RestoManager.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              A restaurant platform that connects customers, restaurant owners,
              and administrators through trusted listings, organized menus, and
              a clear approval workflow.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/restaurants"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_14px_35px_-16px_rgba(0,138,102,0.8)] transition hover:-translate-y-0.5 hover:bg-[#00795a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explore restaurants
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/restaurant/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:bg-secondary/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Register your restaurant
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                "Approved listings",
                "Protected role access",
                "Cloud file storage",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-3xl lg:mx-0 lg:pl-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-16 -z-10 h-[76%] rounded-[3rem] bg-[linear-gradient(145deg,rgba(0,138,102,0.18),rgba(221,244,236,0.32),rgba(255,255,255,0.7))] blur-2xl"
            />

            <div className="relative ml-auto w-[94%] sm:w-[88%]">
              <PublicDiscoveryMockup />
            </div>

            <div className="relative -mt-7 w-[76%] sm:-mt-10 sm:w-[70%] lg:-ml-5">
              <OwnerDashboardMockup />
            </div>

            <div className="absolute -right-1 bottom-3 w-[68%] sm:-right-4 sm:bottom-10 sm:w-[52%] lg:-right-5">
              <AdminReviewMockup />
            </div>

            <div
              aria-hidden="true"
              className="absolute -right-5 top-[34%] hidden h-24 w-24 rounded-full border border-primary/25 sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute -right-1 top-[37%] hidden size-3 rounded-full bg-primary sm:block"
            />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Built around every role"
            title="One connected platform, designed for the whole journey"
            description="RestoManager gives each user exactly what they need while keeping the platform consistent, secure, and easy to understand."
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {roles.map(
              ({ eyebrow, title, description, points, icon: Icon }, index) => (
                <article
                  key={title}
                  className={`group relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.34)] sm:p-8 ${
                    index === 1
                      ? "border-primary/20 bg-[#005f4c] text-white"
                      : "border-border bg-white text-foreground"
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute -right-14 -top-14 size-40 rounded-full ${
                      index === 1 ? "bg-white/[0.07]" : "bg-secondary/65"
                    }`}
                  />
                  <div
                    className={`relative flex size-12 items-center justify-center rounded-2xl ${
                      index === 1
                        ? "bg-white/12 text-white"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <Icon size={23} />
                  </div>
                  <div
                    className={`relative mt-8 text-xs font-extrabold uppercase tracking-[0.18em] ${
                      index === 1 ? "text-emerald-100" : "text-primary"
                    }`}
                  >
                    {eyebrow}
                  </div>
                  <h3 className="relative mt-3 text-2xl font-extrabold leading-tight tracking-[-0.03em]">
                    {title}
                  </h3>
                  <p
                    className={`relative mt-4 text-sm leading-7 ${
                      index === 1
                        ? "text-emerald-50/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {description}
                  </p>
                  <ul className="relative mt-7 space-y-3">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 text-sm font-semibold"
                      >
                        <CheckCircle2
                          size={17}
                          className={
                            index === 1 ? "text-emerald-200" : "text-primary"
                          }
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative border-y border-border/75 bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-48 w-48 rounded-bl-[70%] bg-secondary/50"
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="From restaurant application to customer discovery"
              description="A clear flow keeps restaurant information trustworthy and gives every role a focused experience."
            />

            <div className="lg:justify-self-end">
              <Link
                to="/restaurant/register"
                className="group inline-flex items-center gap-2 text-sm font-extrabold text-primary"
              >
                Start restaurant registration
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="relative mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(0,138,102,0.35),transparent)] xl:block"
            />
            {journey.map(({ step, title, description, icon: Icon }) => (
              <article
                key={step}
                className="relative rounded-3xl border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-sm">
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-extrabold tracking-tighter text-primary/18">
                    {step}
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative min-h-107.5">
            <div className="absolute inset-x-0 top-7 mx-auto h-72 w-[88%] rounded-[3rem] bg-secondary/60" />
            <div className="absolute left-[4%] top-0 w-[78%] -rotate-2">
              <OwnerDashboardMockup />
            </div>
            <div className="absolute bottom-0 right-[2%] w-[68%] rotate-[1.5deg]">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_22px_55px_-28px_rgba(15,23,42,0.38)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-primary">
                      Menu management
                    </div>
                    <div className="mt-1 text-sm font-extrabold text-foreground">
                      Popular dishes
                    </div>
                  </div>
                  <span className="rounded-lg bg-primary px-3 py-2 text-[8px] font-bold text-primary-foreground">
                    + Add item
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {["Classic Burger", "Chicken Pasta", "Caesar Salad"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border border-border px-3 py-2.5"
                      >
                        <div
                          className={`size-8 rounded-lg ${
                            index === 0
                              ? "bg-amber-100"
                              : index === 1
                                ? "bg-orange-100"
                                : "bg-emerald-100"
                          }`}
                        />
                        <div>
                          <div className="text-[8px] font-bold text-foreground">
                            {item}
                          </div>
                          <div className="mt-0.5 text-[7px] text-muted-foreground">
                            Available
                          </div>
                        </div>
                        <span className="text-[8px] font-extrabold text-primary">
                          ${(8.5 + index * 1.75).toFixed(2)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Designed for clarity
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
              Complex restaurant workflows, presented simply.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              The interface keeps actions focused, statuses visible, and
              information organized—whether someone is browsing a menu or
              managing an entire restaurant profile.
            </p>

            <div className="mt-9 space-y-5">
              {[
                {
                  icon: ChefHat,
                  title: "Restaurant-first organization",
                  description:
                    "Profiles, opening hours, categories, and menu items stay connected.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trust through approval",
                  description:
                    "Only reviewed restaurants become part of the public experience.",
                },
                {
                  icon: BadgeCheck,
                  title: "Consistent feedback",
                  description:
                    "Clear loading, success, error, and status states guide each user.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] bg-[#005f4c] px-6 py-14 text-center text-white shadow-[0_30px_80px_-35px_rgba(0,95,76,0.75)] sm:px-10 sm:py-18 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-28 size-64 rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="absolute -left-10 -top-16 size-44 rounded-full border border-white/10"
          />
          <DotPattern className="absolute bottom-7 right-7 opacity-35" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/12 text-emerald-100">
              <UtensilsCrossed size={25} />
            </div>
            <h2 className="mt-7 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Ready to be part of RestoManager?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-emerald-50/80 sm:text-lg">
              Discover approved restaurants as a customer, or create a
              professional digital presence for your restaurant.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/restaurants"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-[#005f4c] transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Browse restaurants
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/restaurant/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.14]"
              >
                Register a restaurant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
