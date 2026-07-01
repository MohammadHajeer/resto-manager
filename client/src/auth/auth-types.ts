export type UserRole = "admin" | "restaurant_owner" | "customer";

export function normalizeRole(
  role: string | null | undefined,
): UserRole | null {
  if (!role) return null;
  const lower = role.toLowerCase().trim();
  if (
    lower === "admin" ||
    lower === "restaurant_owner" ||
    lower === "customer"
  ) {
    return lower as UserRole;
  }
  // Safe mapping for common alternative spelling/spacing
  if (
    lower === "restaurant-owner" ||
    lower === "restaurant owner" ||
    lower === "owner"
  ) {
    return "restaurant_owner";
  }
  return null;
}

export function getDashboardPath(
  role: UserRole | string | null | undefined,
): string {
  const normalized = typeof role === "string" ? normalizeRole(role) : role;
  switch (normalized) {
    case "admin":
      return "/admin/dashboard";
    case "restaurant_owner":
      return "/owner/dashboard";
    case "customer":
      return "/restaurants";
    default:
      return "/";
  }
}
