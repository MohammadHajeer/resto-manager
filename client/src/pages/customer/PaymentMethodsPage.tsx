import { ArrowLeft, Banknote, Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PaymentMethodsPage
 * -------------------
 * Display-only payment methods screen linked from the customer profile.
 * Cash on Delivery is the platform's only method right now — this page
 * mirrors the same locked radio-card used at checkout so the experience
 * is consistent everywhere payment is mentioned.
 *
 * Frontend-only, same as the checkout section: no new database fields,
 * no payment records, no processing. This is simply the natural place to
 * add real payment methods later without touching checkout's structure.
 */
export default function PaymentMethodsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to profile
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Payment Methods
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how you pay for your orders.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Payment method options"
        className="mt-6"
      >
        <div
          role="radio"
          aria-checked="true"
          aria-disabled="true"
          className="flex w-full items-start gap-3 rounded-2xl border border-primary bg-primary/5 p-5"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground"
          >
            <Check className="size-3" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Banknote className="size-5" aria-hidden="true" />
              </span>

              <p className="font-semibold text-foreground">
                Cash on Delivery
              </p>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Lock className="size-3" aria-hidden="true" />
                Only available option
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pay with cash when your order arrives. The courier will
              collect the total amount upon delivery — no card or online
              payment is needed.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        More payment methods will be available here in a future update.
      </p>
    </div>
  );
}
