// src/stores/useCartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  PublicMenuAddon,
  PublicMenuItem,
} from "@/services/public/public.types";

export type CartItem = {
  cartItemKey: string;

  restaurantId: string;
  menuItemId: string;

  name: string;
  imageUrl: string | null;
  basePrice: number;

  quantity: number;
  selectedAddons: PublicMenuAddon[];

  // RES-82: ingredients the customer asked to remove from this item.
  // Pricing-neutral — kept only as a preparation instruction for the
  // restaurant, and included in the cart item key so e.g. "no pickles"
  // is tracked as a separate line from the default version of the item.
  removedIngredients: string[];

  itemTotal: number;
};

type AddCartItemInput = {
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  item: PublicMenuItem;
  quantity: number;
  selectedAddons: PublicMenuAddon[];
  removedIngredients?: string[];
};

type CartState = {
  restaurantId: string | null;

  // Snapshot of the restaurant the cart belongs to, captured when the
  // first item is added. Used by the cart page header and "back to menu"
  // link without needing an extra API call.
  restaurantSlug: string | null;
  restaurantName: string | null;

  items: CartItem[];

  addItem: (input: AddCartItemInput) => void;
  removeItem: (cartItemKey: string) => void;
  increaseQuantity: (cartItemKey: string) => void;
  decreaseQuantity: (cartItemKey: string) => void;
  clearCart: () => void;
};

/** Matches the server-side order item constraint (quantitySchema max 99). */
const MAX_ITEM_QUANTITY = 99;
const MIN_ITEM_QUANTITY = 1;

const createCartItemKey = (
  menuItemId: string,
  selectedAddons: PublicMenuAddon[],
  removedIngredients: string[],
) => {
  const addonKey = selectedAddons
    .map((addon) => addon.name)
    .sort()
    .join("|");

  const removedKey = [...removedIngredients].sort().join("|");

  return `${menuItemId}:${addonKey}:${removedKey}`;
};

/** RES-88: add-ons total for a single unit of an item. */
export const calculateAddonsTotal = (selectedAddons: PublicMenuAddon[]) => {
  return selectedAddons.reduce((total, addon) => {
    return total + addon.price;
  }, 0);
};

/**
 * RES-87: line total = (base price + add-ons) * quantity.
 * Removed ingredients never affect price — they are a preparation
 * instruction, not a discount.
 */
export const calculateItemTotal = (
  basePrice: number,
  quantity: number,
  selectedAddons: PublicMenuAddon[],
) => {
  return (basePrice + calculateAddonsTotal(selectedAddons)) * quantity;
};

/** Cart subtotal across all line items. */
export const calculateCartSubtotal = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + item.itemTotal;
  }, 0);
};

/** Total unit count (used by the header cart badge). */
export const calculateCartItemCount = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

const setItemQuantity = (item: CartItem, quantity: number): CartItem => {
  const clampedQuantity = Math.min(
    MAX_ITEM_QUANTITY,
    Math.max(MIN_ITEM_QUANTITY, quantity),
  );

  return {
    ...item,
    quantity: clampedQuantity,
    itemTotal: calculateItemTotal(
      item.basePrice,
      clampedQuantity,
      item.selectedAddons,
    ),
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      restaurantId: null,
      restaurantSlug: null,
      restaurantName: null,
      items: [],

      addItem: ({
        restaurantId,
        restaurantSlug,
        restaurantName,
        item,
        quantity,
        selectedAddons,
        removedIngredients = [],
      }) => {
        set((state) => {
          const cartItemKey = createCartItemKey(
            item._id,
            selectedAddons,
            removedIngredients,
          );

          const itemTotal = calculateItemTotal(
            item.price,
            quantity,
            selectedAddons,
          );

          const newCartItem: CartItem = {
            cartItemKey,
            restaurantId,
            menuItemId: item._id,
            name: item.name,
            imageUrl: item.imageUrl,
            basePrice: item.price,
            quantity,
            selectedAddons,
            removedIngredients,
            itemTotal,
          };

          // MVP rule: one restaurant per cart.
          // If user adds from another restaurant, replace old cart.
          if (state.restaurantId && state.restaurantId !== restaurantId) {
            return {
              restaurantId,
              restaurantSlug,
              restaurantName,
              items: [newCartItem],
            };
          }

          const existingItem = state.items.find(
            (cartItem) => cartItem.cartItemKey === cartItemKey,
          );

          if (!existingItem) {
            return {
              restaurantId,
              restaurantSlug,
              restaurantName,
              items: [...state.items, newCartItem],
            };
          }

          return {
            restaurantId,
            restaurantSlug,
            restaurantName,
            items: state.items.map((cartItem) => {
              if (cartItem.cartItemKey !== cartItemKey) {
                return cartItem;
              }

              return setItemQuantity(
                cartItem,
                cartItem.quantity + quantity,
              );
            }),
          };
        });
      },

      removeItem: (cartItemKey) => {
        set((state) => {
          const items = state.items.filter(
            (item) => item.cartItemKey !== cartItemKey,
          );

          // Removing the last item fully resets the cart so a stale
          // restaurant reference is never left behind.
          if (items.length === 0) {
            return {
              restaurantId: null,
              restaurantSlug: null,
              restaurantName: null,
              items,
            };
          }

          return { items };
        });
      },

      increaseQuantity: (cartItemKey) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemKey === cartItemKey
              ? setItemQuantity(item, item.quantity + 1)
              : item,
          ),
        }));
      },

      decreaseQuantity: (cartItemKey) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemKey === cartItemKey
              ? setItemQuantity(item, item.quantity - 1)
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({
          restaurantId: null,
          restaurantSlug: null,
          restaurantName: null,
          items: [],
        });
      },
    }),
    {
      name: "restomanager-cart",
      version: 2,
      // v1 -> v2: cart items gained `removedIngredients` and the
      // cartItemKey format changed to include it. Old persisted carts
      // are not patchable, so we simply start fresh.
      migrate: () => ({
        restaurantId: null,
        restaurantSlug: null,
        restaurantName: null,
        items: [],
      }),
    },
  ),
);
