import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

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
import RestaurantListingPage from "./pages/public/RestaurantListingPage";
import RestaurantMenuPage from "./pages/public/RestaurantMenuPage";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import Support from "./pages/public/Support";

// Pages: Auth
import LoginPage from "./pages/auth/LoginPage";
import CustomerSignUpPage from "./pages/auth/CustomerSignUpPage";
import RestaurantRegisterPage from "./pages/auth/RestaurantRegisterPage";

// Pages: Customer
import MenuItemDetailsPage from "./pages/customer/MenuItemDetailsPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import AddressesPage from "./pages/customer/AddressesPage";
import PaymentMethodsPage from "./pages/customer/PaymentMethodsPage";
import CustomerOrderHistoryPage from "./pages/customer/CustomerOrderHistoryPage";
import CustomerOrderDetailsPage from "./pages/customer/CustomerOrderDetailsPage";

// Pages: Owner
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";
import RestaurantProfilePage from "./pages/owner/RestaurantProfilePage";
import MenuManagementPage from "./pages/owner/MenuManagementPage";
import OwnerOrdersPage from "./pages/owner/OwnerOrdersPage";
import OwnerStatusPage from "./pages/owner/OwnerStatusPage";

// Pages: Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRestaurantsPage from "./pages/admin/AdminRestaurantsPage";
import AdminRestaurantReviewPage from "./pages/admin/AdminRestaurantReviewPage";

// Pages: Shared
import NotFoundPage from "./pages/shared/NotFoundPage";
import AddMenuItemPage from "./pages/owner/AddMenuItemPage";
import EditMenuItemPage from "./pages/owner/EditMenuItemPage";
import { AuthLayout } from "./components/layouts/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Guest Routes */}
        <Route
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<CustomerSignUpPage />} />
          <Route
            path="/restaurant/register"
            element={<RestaurantRegisterPage />}
          />
        </Route>

        {/* Public & Customer Browsing Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />

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
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
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
            <Route path="/owner/menu/new" element={<AddMenuItemPage />} />
            <Route
              path="/owner/menu/:menuItemId/edit"
              element={<EditMenuItemPage />}
            />
            <Route path="/owner/orders" element={<OwnerOrdersPage />} />
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
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
