/**
 * AdminRestaurantsPage — re-exports the folder-based implementation.
 *
 * This shim exists because Vite resolves .tsx files before folder/index.tsx,
 * so without it the old broken flat implementation would be loaded instead of
 * the correct one in ./AdminRestaurantsPage/index.tsx
 */
export { default } from "./AdminRestaurantsPage/index";
