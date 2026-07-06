import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";

// Layouts
import { MainLayout } from "./components/layouts/MainLayout";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { adminNavItems, ownerNavItems } from "./config/dashboard-navigation";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import GuestRoute from "./routes/GuestRoute";
import RequireApprovedOwner from "./routes/RequireApprovedOwner";

// Pages: Public
import LandingPage from "./pages/public/LandingPage";

// Pages: Auth
import LoginPage from "./pages/auth/LoginPage";
import CustomerSignUpPage from "./pages/auth/CustomerSignUpPage";
import RestaurantRegisterPage from "./pages/auth/RestaurantRegisterPage";

// Pages: Customer
import RestaurantListingPage from "./pages/customer/RestaurantListingPage";
import RestaurantMenuPage from "./pages/customer/RestaurantMenuPage";
import MenuItemDetailsPage from "./pages/customer/MenuItemDetailsPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import CustomerOrderHistoryPage from "./pages/customer/CustomerOrderHistoryPage";
import CustomerOrderDetailsPage from "./pages/customer/CustomerOrderDetailsPage";

// Pages: Owner
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";
import RestaurantProfilePage from "./pages/owner/RestaurantProfilePage";
import MenuManagementPage from "./pages/owner/MenuManagementPage";
import OwnerOrdersPage from "./pages/owner/OwnerOrdersPage";
import OwnerOrderDetailsPage from "./pages/owner/OwnerOrderDetailsPage";
import OwnerStatusPage from "./pages/owner/OwnerStatusPage";

// Pages: Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRestaurantsPage from "./pages/admin/AdminRestaurantsPage";
import AdminRestaurantReviewPage from "./pages/admin/AdminRestaurantReviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// Pages: Shared
import NotFoundPage from "./pages/shared/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes */}
        <Route
          element={
            <GuestRoute>
              <MainLayout />
            </GuestRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<CustomerSignUpPage />} />
        </Route>

        {/* Public & Customer Browsing Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/restaurant/register"
            element={<RestaurantRegisterPage />}
          />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route
            path="/restaurants/:restaurantSlug"
            element={<RestaurantMenuPage />}
          />
          <Route
            path="/restaurants/:restaurantSlug/items/:itemSlug"
            element={<MenuItemDetailsPage />}
          />
        </Route>

        {/* Protected Customer Routes */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["customer"]}>
                <MainLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/orders/success/:orderId"
            element={<OrderConfirmationPage />}
          />
          <Route path="/profile" element={<CustomerProfilePage />} />
          <Route path="/orders" element={<CustomerOrderHistoryPage />} />
          <Route
            path="/orders/:orderId"
            element={<CustomerOrderDetailsPage />}
          />
        </Route>

        {/* Protected Owner Routes */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["restaurant_owner"]}>
                <Outlet />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/owner/status" element={<OwnerStatusPage />} />
          <Route
            element={
              <RequireApprovedOwner>
                <DashboardLayout
                  title="Owner workspace"
                  subtitle="Manage your restaurant, menu, and customer orders."
                  navItems={ownerNavItems}
                  userRole="restaurant_owner"
                />
              </RequireApprovedOwner>
            }
          >
            <Route
              path="/owner"
              element={<Navigate to="/owner/dashboard" replace />}
            />
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/profile" element={<RestaurantProfilePage />} />
            <Route path="/owner/menu" element={<MenuManagementPage />} />
            <Route path="/owner/orders" element={<OwnerOrdersPage />} />
            <Route
              path="/owner/orders/:orderId"
              element={<OwnerOrderDetailsPage />}
            />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <DashboardLayout
                  title="Admin workspace"
                  subtitle="Monitor restaurants, approvals, users, and orders."
                  navItems={adminNavItems}
                  userRole="admin"
                />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
          <Route
            path="/admin/restaurants/:restaurantId"
            element={<AdminRestaurantReviewPage />}
          />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster richColors position="bottom-right" />
    </BrowserRouter>
  );
}
