import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  IdCard,
  ImageIcon,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Store,
  UserRound,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveRestaurant,
  useRejectRestaurant,
  useRestaurantById,
} from "@/hooks/admin/useAdminRestaurants";
import type { AdminRestaurantDetails } from "@/services/admin.service";

type DocumentKey = "businessLicense" | "ownerIdDocument";
type RestaurantStatus = AdminRestaurantDetails["status"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const statusStyles: Record<RestaurantStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-primary/20 bg-primary/10 text-primary",
  rejected: "border-destructive/20 bg-destructive/10 text-destructive",
  suspended: "border-border bg-muted text-muted-foreground",
};

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : dateFormatter.format(date);
}

function getDocumentType(path: string) {
  const extension = path.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp"].includes(extension ?? "")) {
    return "image";
  }
  return "unknown";
}

function StatusBadge({ status }: { status: RestaurantStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-foreground">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

type DocumentCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
  selected: boolean;
  onSelect: () => void;
};

function DocumentCard({
  title,
  description,
  icon,
  available,
  selected,
  onSelect,
}: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={`mt-1 size-2 rounded-full ${
          available ? "bg-primary" : "bg-muted-foreground/40"
        }`}
      />
    </button>
  );
}

type DocumentPreviewProps = {
  title: string;
  filePath: string;
  signedUrl: string | null;
};

function DocumentPreview({ title, filePath, signedUrl }: DocumentPreviewProps) {
  if (!signedUrl) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-6 text-center">
        <FileText className="size-9 text-muted-foreground" aria-hidden="true" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          Document unavailable
        </h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          A secure preview link is not available for this document.
        </p>
      </div>
    );
  }

  const documentType = getDocumentType(filePath);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-border bg-muted/30">
        {documentType === "pdf" && (
          <iframe
            src={signedUrl}
            title={`${title} preview`}
            className="h-128 w-full bg-card"
          />
        )}
        {documentType === "image" && (
          <img
            src={signedUrl}
            alt={`${title} preview`}
            className="max-h-128 w-full object-contain"
          />
        )}
        {documentType === "unknown" && (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <ImageIcon
              className="size-9 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              This file type cannot be previewed here.
            </p>
          </div>
        )}
      </div>

      <Button
        nativeButton={false}
        variant="outline"
        className="w-full rounded-md"
        render={<a href={signedUrl} target="_blank" rel="noreferrer" />}
      >
        <ExternalLink aria-hidden="true" />
        Open document in a new tab
      </Button>
    </div>
  );
}

function ReviewPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading restaurant review</span>
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-6">
          {["h-44", "h-36", "h-32"].map((heightClass) => (
            <div
              key={heightClass}
              className="animate-pulse rounded-md border border-border bg-card p-6"
            >
              <div className="h-5 w-40 rounded bg-muted" />
              <div className={`mt-5 ${heightClass} rounded bg-muted/70`} />
            </div>
          ))}
        </div>
        <div className="h-128 animate-pulse rounded-md border border-border bg-card" />
      </div>
    </div>
  );
}

export default function AdminRestaurantReviewPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentKey>("businessLicense");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonError, setRejectionReasonError] = useState("");
  const {
    data: restaurant,
    isLoading,
    isError,
    refetch,
  } = useRestaurantById(restaurantId ?? "");
  const approveRestaurant = useApproveRestaurant();
  const rejectRestaurant = useRejectRestaurant();
  const isMutating = approveRestaurant.isPending || rejectRestaurant.isPending;

  const handleApproveRestaurant = () => {
    if (!restaurant?._id) return;

    approveRestaurant.mutate(restaurant._id, {
      onSuccess: () => {
        setApproveDialogOpen(false);
        toast.success("Restaurant approved successfully.");
        navigate("/admin/approvals");
      },
      onError: () => {
        toast.error("Failed to approve restaurant. Please try again.");
      },
    });
  };

  const handleRejectRestaurant = () => {
    if (!restaurant?._id) return;

    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      setRejectionReasonError("A rejection reason is required.");
      return;
    }

    rejectRestaurant.mutate(
      {
        restaurantId: restaurant._id,
        rejectionReason: trimmedReason,
      },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setRejectionReason("");
          setRejectionReasonError("");
          toast.success("Restaurant rejected successfully.");
          navigate("/admin/approvals");
        },
        onError: () => {
          toast.error("Failed to reject restaurant. Please try again.");
        },
      },
    );
  };

  const handleRejectDialogChange = (nextOpen: boolean) => {
    if (rejectRestaurant.isPending) return;

    setRejectDialogOpen(nextOpen);
    if (!nextOpen) {
      setRejectionReason("");
      setRejectionReasonError("");
    }
  };

  if (isLoading) return <ReviewPageSkeleton />;

  if (isError) {
    return (
      <section className="rounded-md border border-destructive/20 bg-destructive/5 px-6 py-14 text-center">
        <AlertCircle
          className="mx-auto size-9 text-destructive"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-lg font-semibold text-foreground">
          Unable to load restaurant
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          The restaurant review could not be loaded. Check your connection and
          try again.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          className="mt-5 rounded-md"
        >
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </section>
    );
  }

  if (!restaurant) {
    return (
      <section className="rounded-md border border-border bg-card px-6 py-14 text-center">
        <Store
          className="mx-auto size-9 text-muted-foreground"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-lg font-semibold text-foreground">
          Restaurant not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This registration may have been removed or is no longer available.
        </p>
        <Button
          nativeButton={false}
          variant="outline"
          className="mt-5 rounded-md"
          render={<Link to="/admin/approvals" />}
        >
          <ArrowLeft aria-hidden="true" />
          Back to approvals
        </Button>
      </section>
    );
  }

  const address = [
    restaurant.address.building,
    restaurant.address.street,
    restaurant.address.floor,
    restaurant.address.city,
  ]
    .filter(Boolean)
    .join(", ");
  const selectedPreview =
    selectedDocument === "businessLicense"
      ? {
          title: "Business license",
          path: restaurant.verification.businessLicensePath,
          url: restaurant.verification.businessLicenseSignedUrl,
        }
      : {
          title: "Owner ID document",
          path: restaurant.verification.ownerIdDocumentPath,
          url: restaurant.verification.ownerIdDocumentSignedUrl,
        };

  return (
    <div className="space-y-6">
      <Button
        nativeButton={false}
        variant="ghost"
        className="rounded-md text-muted-foreground"
        render={<Link to="/admin/approvals" />}
      >
        <ArrowLeft aria-hidden="true" />
        Back to approvals
      </Button>

      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Restaurant review
            </h1>
            <StatusBadge status={restaurant.status} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Review {restaurant.name}&apos;s profile, owner details, and secure
            verification documents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            disabled={restaurant.status !== "pending" || isMutating}
            onClick={() => setRejectDialogOpen(true)}
            className="rounded-md"
          >
            {rejectRestaurant.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <XCircle aria-hidden="true" />
            )}
            {rejectRestaurant.isPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            type="button"
            disabled={restaurant.status !== "pending" || isMutating}
            onClick={() => setApproveDialogOpen(true)}
            className="rounded-md"
          >
            {approveRestaurant.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 aria-hidden="true" />
            )}
            {approveRestaurant.isPending ? "Approving..." : "Approve"}
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.9fr)]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="relative h-44 bg-muted sm:h-56">
              {restaurant.bannerUrl ? (
                <img
                  src={restaurant.bannerUrl}
                  alt={`${restaurant.name} banner`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-10" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
                  {restaurant.logoUrl ? (
                    <img
                      src={restaurant.logoUrl}
                      alt={`${restaurant.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store
                      className="size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-foreground">
                    {restaurant.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    /{restaurant.slug}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-foreground/80">
                {restaurant.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {restaurant.cuisineTypes.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2 border-t border-border pt-5 text-sm text-foreground/80">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>{address || "Address not provided"}</span>
              </div>
            </div>
          </section>

          <SectionCard
            title="Owner and contact"
            icon={<UserRound className="size-4" aria-hidden="true" />}
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              <InfoRow label="Owner name" value={restaurant.owner?.name} />
              <InfoRow label="Owner role" value={restaurant.owner?.role} />
              <InfoRow
                label="Owner email"
                value={
                  restaurant.owner?.email ? (
                    <a
                      href={`mailto:${restaurant.owner.email}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Mail className="size-3.5" aria-hidden="true" />
                      {restaurant.owner.email}
                    </a>
                  ) : undefined
                }
              />
              <InfoRow label="Owner phone" value={restaurant.owner?.phone} />
              <InfoRow
                label="Restaurant phone"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" aria-hidden="true" />
                    {restaurant.contact.phone}
                  </span>
                }
              />
              <InfoRow
                label="Restaurant email"
                value={restaurant.contact.email}
              />
            </dl>
          </SectionCard>

          <SectionCard
            title="Application details"
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              <InfoRow
                label="Submitted"
                value={formatDate(restaurant.verification.submittedAt)}
              />
              <InfoRow
                label="Profile created"
                value={formatDate(restaurant.createdAt)}
              />
              <InfoRow
                label="Reviewed"
                value={formatDate(restaurant.verification.reviewedAt)}
              />
              <InfoRow
                label="Reviewed by"
                value={restaurant.verification.reviewedBy}
              />
            </dl>

            {restaurant.verification.rejectionReason && (
              <div className="mt-5 rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-xs font-semibold uppercase text-destructive">
                  Rejection reason
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground/80">
                  {restaurant.verification.rejectionReason}
                </p>
              </div>
            )}
          </SectionCard>
        </div>

        <section className="rounded-md border border-border bg-card p-5 shadow-sm sm:p-6 xl:sticky xl:top-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">
              Verification documents
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Select a submitted document to inspect its secure preview.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <DocumentCard
              title="Business license"
              description="Restaurant operating license"
              icon={<FileText className="size-4" aria-hidden="true" />}
              available={Boolean(
                restaurant.verification.businessLicenseSignedUrl,
              )}
              selected={selectedDocument === "businessLicense"}
              onSelect={() => setSelectedDocument("businessLicense")}
            />
            <DocumentCard
              title="Owner ID document"
              description="Submitted identity document"
              icon={<IdCard className="size-4" aria-hidden="true" />}
              available={Boolean(
                restaurant.verification.ownerIdDocumentSignedUrl,
              )}
              selected={selectedDocument === "ownerIdDocument"}
              onSelect={() => setSelectedDocument("ownerIdDocument")}
            />
          </div>

          <div className="mt-5">
            <DocumentPreview
              title={selectedPreview.title}
              filePath={selectedPreview.path}
              signedUrl={selectedPreview.url}
            />
          </div>
        </section>
      </div>

      <AlertDialog
        open={approveDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!approveRestaurant.isPending) setApproveDialogOpen(nextOpen);
        }}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 text-card-foreground shadow-xl sm:max-w-md">
          <AlertDialogHeader className="gap-2 p-6 sm:gap-x-4">
            <AlertDialogMedia className="mb-1 size-12 bg-primary/10 text-primary sm:mb-0">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-xl font-semibold text-foreground">
              Approve restaurant?
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-6 text-muted-foreground">
              Are you sure you want to approve this restaurant? Once approved,
              the owner will be able to access the restaurant dashboard and
              start managing the restaurant.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-t border-border bg-muted/30 p-4 sm:px-6">
            <AlertDialogCancel
              size="lg"
              disabled={approveRestaurant.isPending}
              className="rounded-md"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              size="lg"
              disabled={approveRestaurant.isPending}
              onClick={(event) => {
                event.preventDefault();
                handleApproveRestaurant();
              }}
              className="rounded-md"
            >
              {approveRestaurant.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 aria-hidden="true" />
                  Approve restaurant
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={rejectDialogOpen}
        onOpenChange={handleRejectDialogChange}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 text-card-foreground shadow-xl sm:max-w-md">
          <AlertDialogHeader className="gap-2 p-6 pb-4 sm:gap-x-4">
            <AlertDialogMedia className="mb-1 size-12 bg-destructive/10 text-destructive sm:mb-0">
              <XCircle className="size-5" aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-xl font-semibold text-foreground">
              Reject restaurant?
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-6 text-muted-foreground">
              Please provide a reason for rejecting this restaurant
              application. This reason may be shown to the restaurant owner.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-6 pb-6">
            <label
              htmlFor="rejection-reason"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Rejection reason <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
                if (event.target.value.trim()) setRejectionReasonError("");
              }}
              placeholder="Write the rejection reason..."
              disabled={rejectRestaurant.isPending}
              aria-invalid={Boolean(rejectionReasonError)}
              aria-describedby={
                rejectionReasonError ? "rejection-reason-error" : undefined
              }
              className="min-h-28 resize-none"
            />
            {rejectionReasonError && (
              <p
                id="rejection-reason-error"
                role="alert"
                className="mt-2 text-sm text-destructive"
              >
                {rejectionReasonError}
              </p>
            )}
          </div>

          <AlertDialogFooter className="border-t border-border bg-muted/30 p-4 sm:px-6">
            <AlertDialogCancel
              size="lg"
              disabled={rejectRestaurant.isPending}
              className="rounded-md"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              size="lg"
              disabled={
                rejectRestaurant.isPending || !rejectionReason.trim()
              }
              onClick={(event) => {
                event.preventDefault();
                handleRejectRestaurant();
              }}
              className="rounded-md"
            >
              {rejectRestaurant.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle aria-hidden="true" />
                  Reject restaurant
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
