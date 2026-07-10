import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Heart,
  History,
  MapPin,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
});

type BasicInfoForm = {
  name: string;
  phone: string;
};

export default function CustomerProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState<BasicInfoForm>({ name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      phone: (user as { phone?: string }).phone ?? "",
    });
  }, [user]);

  const isDirty =
    !!user &&
    (form.name !== (user.name ?? "") ||
      form.phone !== ((user as { phone?: string }).phone ?? ""));

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return null;
    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
  }, [user?.createdAt]);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const checks = [
      Boolean(user.name),
      Boolean((user as { phone?: string }).phone),
      Boolean(user.image),
      Boolean(user.emailVerified),
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [user]);

  async function handleSave() {
    if (!isDirty) return;

    setIsSaving(true);

    try {
      await authClient.updateUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      await refetch();
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDiscard() {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      phone: (user as { phone?: string }).phone ?? "",
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-accent to-background px-5 py-6 sm:px-7 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <span className="inline-flex w-fit items-center rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Customer profile
              </span>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                  Your Profile
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                  Manage your personal information, delivery addresses, and payment preferences.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                disabled={!isDirty || isSaving}
                className="h-11 rounded-xl border-border/80 bg-card px-5 shadow-sm"
              >
                Discard
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="h-11 rounded-xl bg-primary px-5 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-7 lg:p-8">
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-secondary via-card to-card shadow-sm">
              <div className="h-20 bg-gradient-to-r from-primary to-chart-2" />

              <div className="relative px-5 pb-5">
                <div className="-mt-9 flex size-[4.75rem] items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-primary/10 text-xl font-bold text-primary shadow-sm">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="size-full object-cover"
                    />
                  ) : (
                    user?.name?.[0]?.toUpperCase() ?? "?"
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-lg font-semibold text-foreground">
                    {isPending ? "Loading..." : (user?.name ?? "Your account")}
                  </p>
                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {user?.email ?? "No email available"}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-primary/10 bg-background/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Profile completion
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {profileCompletion}%
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <nav
              className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm"
              aria-label="Profile sections"
            >
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Account navigation
                </p>
              </div>

              <div className="p-2">
                <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-primary shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <UserRound className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate">Account Details</p>
                    <p className="text-xs font-medium text-primary/80">
                      Personal information
                    </p>
                  </div>
                </div>

                <Link
                  to="/addresses"
                  className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  Saved Addresses
                </Link>

                <Link
                  to="/payment-methods"
                  className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <CreditCard className="size-4" aria-hidden="true" />
                  </span>
                  Payment Methods
                </Link>

                {[{ label: "Preferences", icon: Settings2 }].map(
                  ({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="mt-2 flex cursor-not-allowed items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground/75 transition-colors"
                      title="Coming soon"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="truncate">{label}</span>
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Soon
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="border-t border-border/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Shortcuts
                </p>
              </div>

              <div className="p-2 pt-0">
                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <History className="size-4" aria-hidden="true" />
                  </span>
                  Order History
                </Link>

                <div
                  className="mt-2 flex cursor-not-allowed items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground/75"
                  title="Coming soon"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Heart className="size-4" aria-hidden="true" />
                    </span>
                    <span className="truncate">Saved Restaurants</span>
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Soon
                  </span>
                </div>
              </div>
            </nav>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-border/70 bg-card text-card-foreground shadow-sm">
              <div className="border-b border-border/60 bg-muted/40 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <UserRound className="size-5" aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Basic Information
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Update your personal identity and contact details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Full Name
                    </span>
                    <Input
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Your full name"
                      className="mt-2 h-11 rounded-xl border-border/80 bg-background shadow-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Email Address
                    </span>
                    <Input
                      value={user?.email ?? ""}
                      readOnly
                      disabled
                      className="mt-2 h-11 rounded-xl border-border/80 bg-muted/70 text-muted-foreground disabled:opacity-100"
                    />
                    <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                      Contact support to change your email address.
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Phone Number
                    </span>
                    <Input
                      value={form.phone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 h-11 rounded-xl border-border/80 bg-background shadow-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Membership
                    </span>
                    <Input
                      value={
                        memberSince ? `Gold Member (Since ${memberSince})` : "Gold Member"
                      }
                      readOnly
                      disabled
                      className="mt-2 h-11 rounded-xl border-border/80 bg-muted/70 text-muted-foreground disabled:opacity-100"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-border/70 bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Security & Password
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Change your password and manage two-factor authentication.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled
                  title="Coming soon"
                  className="h-11 rounded-xl border-border/80 bg-card px-5"
                >
                  Manage Security
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}