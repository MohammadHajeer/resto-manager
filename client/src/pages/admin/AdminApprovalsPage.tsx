import { usePendingRestaurants } from "@/hooks/admin/useAdminRestaurants";
import { useNavigate } from "react-router-dom";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminApprovalsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = usePendingRestaurants(1, 10);

  const pendingRestaurants = data?.restaurants ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return <p>Loading pending restaurants...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Failed to load pending restaurants.</p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

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
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {pendingRestaurants.length === 0 ? (
          // ── EMPTY STATE ──
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            {/* Checkmark icon */}
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#16A34A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              All caught up!
            </h2>
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
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Restaurant
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Owner
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Email
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Submitted
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-[#374151]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {pendingRestaurants.map((restaurant, index) => (
                  <tr
                    key={restaurant._id}
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
                      {restaurant.owner?.name}
                    </td>

                    {/* Owner email */}
                    <td className="px-5 py-4 text-[#6B7280]">
                      {restaurant.owner?.email}
                    </td>

                    {/* Date submitted */}
                    <td className="px-5 py-4 text-[#6B7280]">
                      {formatDate(restaurant.createdAt)}
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
                          navigate(`/admin/approvals/${restaurant._id}`)
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
