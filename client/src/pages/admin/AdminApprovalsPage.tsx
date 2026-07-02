
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface PendingRestaurant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  submittedAt: string; // ISO date string
}

// ---------------------------------------------------------------------------
// MOCK DATA
// Replace this with a real API call in a future ticket.
// ---------------------------------------------------------------------------
const MOCK_PENDING: PendingRestaurant[] = [
  {
    id: "rest-001",
    name: "Al Sham Restaurant",
    ownerName: "Khalid Mansour",
    ownerEmail: "khalid@alsham.com",
    submittedAt: "2026-06-28T10:15:00Z",
  },
  {
    id: "rest-002",
    name: "Pizza Palace",
    ownerName: "Sara Haddad",
    ownerEmail: "sara@pizzapalace.com",
    submittedAt: "2026-06-29T14:40:00Z",
  },
  {
    id: "rest-003",
    name: "Burger Boutique",
    ownerName: "Omar Khalil",
    ownerEmail: "omar@burgerboutique.com",
    submittedAt: "2026-06-30T09:05:00Z",
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Formats an ISO date string into a readable date, e.g. "Jun 28, 2026" */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function AdminApprovalsPage() {
  const navigate = useNavigate();

  const pending = MOCK_PENDING; // TODO: replace with API data

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Pending Approvals</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Review and approve or reject new restaurant registration requests.
        </p>
      </div>

      {/* ── SUMMARY BADGE ── */}
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full">
        {/* Clock icon */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        {pending.length === 0
          ? "No pending requests"
          : `${pending.length} request${pending.length !== 1 ? "s" : ""} awaiting review`}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">

        {pending.length === 0 ? (
          // ── EMPTY STATE ──
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            {/* Checkmark icon */}
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-[#0F172A]">All caught up!</h2>
            <p className="mt-1 text-sm text-[#6B7280] max-w-xs">
              There are no pending restaurant registrations right now.
            </p>
          </div>

        ) : (
          // ── TABLE ──
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-[#E2E8F0] text-left">
                  <th className="px-5 py-3 font-semibold text-[#374151]">#</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Restaurant</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Owner</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Email</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Submitted</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Status</th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {pending.map((restaurant, index) => (
                  <tr
                    key={restaurant.id}
                    className="hover:bg-[#F8FAF9] transition-colors"
                  >
                    {/* Row number */}
                    <td className="px-5 py-4 text-[#6B7280]">{index + 1}</td>

                    {/* Restaurant name */}
                    <td className="px-5 py-4 font-medium text-[#0F172A]">
                      {restaurant.name}
                    </td>

                    {/* Owner name */}
                    <td className="px-5 py-4 text-[#374151]">
                      {restaurant.ownerName}
                    </td>

                    {/* Owner email */}
                    <td className="px-5 py-4 text-[#6B7280]">
                      {restaurant.ownerEmail}
                    </td>

                    {/* Date submitted */}
                    <td className="px-5 py-4 text-[#6B7280]">
                      {formatDate(restaurant.submittedAt)}
                    </td>

                    {/* Status badge — always "Pending" on this page */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    </td>

                    {/* Review button — navigates to the detail review page */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/approvals/${restaurant.id}`)
                        }
                        className="px-4 py-1.5 rounded-md bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] transition-colors"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
