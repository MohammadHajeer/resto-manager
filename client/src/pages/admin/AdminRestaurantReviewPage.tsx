/**
 * AdminRestaurantReviewPage.tsx
 * ------------------------------
 * RES-36: Add restaurant details review view
 *
 * PURPOSE:
 *   Full detail view for a single pending restaurant registration.
 *   The admin can read all submitted information and then either
 *   APPROVE or REJECT the registration from this page.
 *
 * ROUTE:
 *   /admin/approvals/:restaurantId  (inside AdminLayout — wired in App.tsx)
 *
 * DATA:
 *   Currently uses LOCAL mock data keyed by :restaurantId so the UI
 *   is fully functional and testable without a backend.
 *   TODO: Replace MOCK_DETAILS lookup with a real API call:
 *         GET /api/admin/restaurants/:restaurantId
 *
 * APPROVE FLOW:
 *   1. Admin clicks "Approve" button.
 *   2. A confirmation modal appears: "Approve Al Sham Restaurant?"
 *   3. Admin clicks "Yes, Approve" — status set to "approved".
 *   4. Success banner appears, buttons are disabled.
 *   TODO: Call PATCH /api/admin/restaurants/:id with { status: "approved" }
 *
 * REJECT FLOW:
 *   1. Admin clicks "Reject" button.
 *   2. A confirmation modal appears with a required rejection reason textarea.
 *   3. Admin types a reason and clicks "Yes, Reject".
 *   4. Success banner appears, buttons are disabled.
 *   TODO: Call PATCH /api/admin/restaurants/:id with { status: "rejected", reason }
 *
 * NAVIGATION:
 *   "← Back to Approvals" link at the top always returns to /admin/approvals.
 *
 * SECTIONS SHOWN:
 *   1. Basic Info    — name, cuisine type, phone, address
 *   2. Owner Info    — owner name, email
 *   3. Description   — the restaurant's own description text
 *
 * DESIGN:
 *   Consistent with AdminLayout and AdminApprovalsPage visual language:
 *   white cards on #F8FAF9, #0F172A text, #E2E8F0 borders,
 *   green approve button, red reject button.
 */

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type RegistrationStatus = "pending" | "approved" | "rejected";

interface RestaurantDetail {
  id: string;
  name: string;
  cuisineType: string;
  phone: string;
  address: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  submittedAt: string;
  status: RegistrationStatus;
}

// ---------------------------------------------------------------------------
// MOCK DATA
// Keyed by restaurantId — matches the IDs used in AdminApprovalsPage.
// Replace this lookup with a real GET /api/admin/restaurants/:id call.
// ---------------------------------------------------------------------------
const MOCK_DETAILS: Record<string, RestaurantDetail> = {
  "rest-001": {
    id: "rest-001",
    name: "Al Sham Restaurant",
    cuisineType: "Syrian / Middle Eastern",
    phone: "+962 79 000 1111",
    address: "King Abdullah St, Amman, Jordan",
    description:
      "Authentic Syrian cuisine bringing the flavours of Damascus to your table. We specialise in traditional mezze, grilled meats, and freshly baked bread.",
    ownerName: "Khalid Mansour",
    ownerEmail: "khalid@alsham.com",
    submittedAt: "2026-06-28T10:15:00Z",
    status: "pending",
  },
  "rest-002": {
    id: "rest-002",
    name: "Pizza Palace",
    cuisineType: "Italian / Pizza",
    phone: "+962 79 222 3333",
    address: "Mecca St, Amman, Jordan",
    description:
      "Wood-fired Neapolitan pizzas made with imported Italian ingredients. Our dough is fermented for 48 hours for the perfect crust.",
    ownerName: "Sara Haddad",
    ownerEmail: "sara@pizzapalace.com",
    submittedAt: "2026-06-29T14:40:00Z",
    status: "pending",
  },
  "rest-003": {
    id: "rest-003",
    name: "Burger Boutique",
    cuisineType: "American / Burgers",
    phone: "+962 79 444 5555",
    address: "Rainbow St, Amman, Jordan",
    description:
      "Artisan smash burgers with locally sourced beef, house-made sauces, and brioche buns baked fresh every morning.",
    ownerName: "Omar Khalil",
    ownerEmail: "omar@burgerboutique.com",
    submittedAt: "2026-06-30T09:05:00Z",
    status: "pending",
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

/** A single labelled detail row inside an info card */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        {label}
      </span>
      <span className="text-sm text-[#0F172A]">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function AdminRestaurantReviewPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  // Look up mock data for this restaurant
  const restaurant = restaurantId ? MOCK_DETAILS[restaurantId] : undefined;

  // ── Modal state ──
  // "none"    = no modal open
  // "approve" = approve confirmation modal open
  // "reject"  = reject confirmation modal open
  const [modal, setModal] = useState<"none" | "approve" | "reject">("none");

  // Rejection reason — only used when modal === "reject"
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  // ── Decision state — set after admin confirms ──
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  function handleApproveConfirm() {
    // TODO: PATCH /api/admin/restaurants/:id { status: "approved" }
    setDecision("approved");
    setModal("none");
  }

  function handleRejectConfirm() {
    if (!rejectReason.trim()) {
      setRejectReasonError("Please provide a reason for rejection.");
      return;
    }
    // TODO: PATCH /api/admin/restaurants/:id { status: "rejected", reason: rejectReason }
    setDecision("rejected");
    setModal("none");
    setRejectReason("");
    setRejectReasonError("");
  }

  function handleCloseModal() {
    setModal("none");
    setRejectReason("");
    setRejectReasonError("");
  }

  // ---------------------------------------------------------------------------
  // NOT FOUND
  // ---------------------------------------------------------------------------

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-[#0F172A]">Restaurant not found</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          The registration you're looking for doesn't exist or has already been processed.
        </p>
        <Link
          to="/admin/approvals"
          className="mt-6 text-sm font-semibold text-[#16A34A] hover:underline"
        >
          ← Back to Approvals
        </Link>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── BACK LINK ── */}
      <Link
        to="/admin/approvals"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#0F172A] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Approvals
      </Link>

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">{restaurant.name}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Submitted {formatDate(restaurant.submittedAt)}
          </p>
        </div>

        {/* Current status badge */}
        {decision === null && (
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        )}
        {decision === "approved" && (
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-[#16A34A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            Approved
          </span>
        )}
        {decision === "rejected" && (
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        )}
      </div>

      {/* ── SUCCESS BANNER (shown after a decision is made) ── */}
      {decision === "approved" && (
        <div role="alert" className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-[#16A34A] font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {restaurant.name} has been approved. The owner can now log in and manage their restaurant.
        </div>
      )}
      {decision === "rejected" && (
        <div role="alert" className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {restaurant.name} has been rejected. The owner has been notified.
        </div>
      )}

      {/* ── BASIC INFO CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">Restaurant Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Restaurant Name" value={restaurant.name} />
          <DetailRow label="Cuisine Type" value={restaurant.cuisineType} />
          <DetailRow label="Phone Number" value={restaurant.phone} />
          <DetailRow label="Address" value={restaurant.address} />
        </div>
      </div>

      {/* ── OWNER INFO CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">Owner Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow label="Owner Name" value={restaurant.ownerName} />
          <DetailRow label="Owner Email" value={restaurant.ownerEmail} />
        </div>
      </div>

      {/* ── DESCRIPTION CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">Description</h2>
        <p className="text-sm text-[#374151] leading-relaxed">{restaurant.description}</p>
      </div>

      {/* ── ACTION BUTTONS (disabled once a decision is made) ── */}
      {decision === null && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setModal("approve")}
            className="px-6 py-2.5 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors"
          >
            ✓ Approve Registration
          </button>
          <button
            onClick={() => setModal("reject")}
            className="px-6 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            ✕ Reject Registration
          </button>
        </div>
      )}

      {decision !== null && (
        <button
          onClick={() => navigate("/admin/approvals")}
          className="px-6 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold text-[#374151] hover:bg-[#F8FAF9] transition-colors"
        >
          ← Back to Approvals List
        </button>
      )}

      {/* ================================================================
          MODALS
          Rendered at the bottom, outside the main flow.
          An overlay darkens the rest of the page.
          ================================================================ */}

      {/* ── APPROVE MODAL ── */}
      {modal === "approve" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-modal-title"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h3 id="approve-modal-title" className="text-base font-bold text-[#0F172A]">
                Approve Registration?
              </h3>
              <p className="mt-1 text-sm text-[#6B7280]">
                You are about to approve <strong>{restaurant.name}</strong>. The restaurant will
                become visible to customers and the owner will be able to manage their dashboard.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleApproveConfirm}
                className="flex-1 py-2.5 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors"
              >
                Yes, Approve
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#374151] hover:bg-[#F8FAF9] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {modal === "reject" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <div>
              <h3 id="reject-modal-title" className="text-base font-bold text-[#0F172A]">
                Reject Registration?
              </h3>
              <p className="mt-1 text-sm text-[#6B7280]">
                Please provide a reason. This will be shared with{" "}
                <strong>{restaurant.ownerName}</strong>.
              </p>
            </div>

            {/* Rejection reason textarea */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="reject-reason"
                className="text-sm font-medium text-[#0F172A]"
              >
                Reason for rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (e.target.value.trim()) setRejectReasonError("");
                }}
                placeholder="e.g. Incomplete information, invalid address..."
                className={[
                  "w-full px-3 py-2 rounded-lg border text-sm resize-none outline-none transition-colors",
                  "placeholder:text-slate-400",
                  "focus:ring-2 focus:ring-red-400 focus:border-red-400",
                  rejectReasonError
                    ? "border-red-400 bg-red-50"
                    : "border-[#E2E8F0] hover:border-slate-300",
                ].join(" ")}
              />
              {rejectReasonError && (
                <p className="text-xs text-red-500 mt-0.5" role="alert">
                  {rejectReasonError}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleRejectConfirm}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Reject
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#374151] hover:bg-[#F8FAF9] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
