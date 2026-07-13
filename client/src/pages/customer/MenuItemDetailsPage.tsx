import { Navigate, useParams } from "react-router-dom";

/**
 * MenuItemDetailsPage
 * --------------------
 * The full item-detail experience lives in the RestaurantMenuPage's
 * responsive Sheet/Drawer (MenuItemDetailsSheet). This route exists so
 * that a direct link like /restaurants/:slug/items/:itemSlug doesn't
 * 404 — it simply redirects to the restaurant's menu page where the
 * customer can find and open the item from the sheet.
 */
export default function MenuItemDetailsPage() {
  const { restaurantSlug } = useParams<{
    restaurantSlug: string;
    itemSlug: string;
  }>();

  return <Navigate to={`/restaurants/${restaurantSlug ?? ""}`} replace />;
}
