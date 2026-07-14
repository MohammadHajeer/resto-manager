import { useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { CustomerAccountPageHeader } from "@/components/customer/CustomerAccountPageHeader";
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
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState<BasicInfoForm>({ name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const frame = window.requestAnimationFrame(() => {
      setForm({
        name: user.name ?? "",
        phone: (user as { phone?: string }).phone ?? "",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [user]);

  const isDirty =
    !!user &&
    (form.name !== (user.name ?? "") ||
      form.phone !== ((user as { phone?: string }).phone ?? ""));

  const memberSince = (() => {
    if (!user?.createdAt) return null;
    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
  })();

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
    <div className="space-y-6">
      <CustomerAccountPageHeader
        title="Account Details"
        description="Manage your personal information and contact details."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              disabled={!isDirty || isSaving}
              className="h-10 rounded-xl bg-background px-4 shadow-xs"
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="h-10 rounded-xl px-4 shadow-sm shadow-primary/15"
            >
              {isSaving ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <div className="border-b border-border/60 bg-muted/35 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-bold text-foreground">Basic Information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your identity and primary contact information.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="block">
            <span className="text-xs font-semibold text-foreground">
              Full name
            </span>
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Your full name"
              autoComplete="name"
              className="mt-2 h-11 rounded-xl bg-card px-4 shadow-xs"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground">
              Email address
            </span>
            <Input
              value={user?.email ?? ""}
              readOnly
              disabled
              className="mt-2 h-11 rounded-xl bg-muted/60 px-4 text-muted-foreground disabled:opacity-100"
            />
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">
              Contact support to change your email address.
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground">
              Phone number
            </span>
            <Input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className="mt-2 h-11 rounded-xl bg-card px-4 shadow-xs"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-foreground">
              Membership
            </span>
            <Input
              value={
                memberSince
                  ? `Gold Member (Since ${memberSince})`
                  : "Gold Member"
              }
              readOnly
              disabled
              className="mt-2 h-11 rounded-xl bg-muted/60 px-4 text-muted-foreground disabled:opacity-100"
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-foreground">Security & Password</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Password and two-factor authentication settings are coming soon.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled
          title="Coming soon"
          className="h-10 rounded-xl bg-card px-4"
        >
          Manage Security
        </Button>
      </section>
    </div>
  );
}
