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

  itemTotal: number;
};

type AddCartItemInput = {
  restaurantId: string;
  item: PublicMenuItem;
  quantity: number;
  selectedAddons: PublicMenuAddon[];
};

type CartState = {
  restaurantId: string | null;
  items: CartItem[];

  addItem: (input: AddCartItemInput) => void;
  removeItem: (cartItemKey: string) => void;
  clearCart: () => void;
};

const createCartItemKey = (
  menuItemId: string,
  selectedAddons: PublicMenuAddon[],
) => {
  const addonKey = selectedAddons
    .map((addon) => addon.name)
    .sort()
    .join("|");

  return `${menuItemId}:${addonKey}`;
};

const calculateItemTotal = (
  basePrice: number,
  quantity: number,
  selectedAddons: PublicMenuAddon[],
) => {
  const addonsTotal = selectedAddons.reduce((total, addon) => {
    return total + addon.price;
  }, 0);

  return (basePrice + addonsTotal) * quantity;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      restaurantId: null,
      items: [],

      addItem: ({ restaurantId, item, quantity, selectedAddons }) => {
        set((state) => {
          const cartItemKey = createCartItemKey(item._id, selectedAddons);

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
            itemTotal,
          };

          // MVP rule: one restaurant per cart.
          // If user adds from another restaurant, replace old cart.
          if (state.restaurantId && state.restaurantId !== restaurantId) {
            return {
              restaurantId,
              items: [newCartItem],
            };
          }

          const existingItem = state.items.find(
            (cartItem) => cartItem.cartItemKey === cartItemKey,
          );

          if (!existingItem) {
            return {
              restaurantId,
              items: [...state.items, newCartItem],
            };
          }

          return {
            restaurantId,
            items: state.items.map((cartItem) => {
              if (cartItem.cartItemKey !== cartItemKey) {
                return cartItem;
              }

              const newQuantity = cartItem.quantity + quantity;

              return {
                ...cartItem,
                quantity: newQuantity,
                itemTotal: calculateItemTotal(
                  cartItem.basePrice,
                  newQuantity,
                  cartItem.selectedAddons,
                ),
              };
            }),
          };
        });
      },

      removeItem: (cartItemKey) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemKey !== cartItemKey),
        }));
      },

      clearCart: () => {
        set({
          restaurantId: null,
          items: [],
        });
      },
    }),
    {
      name: "restomanager-cart",
    },
  ),
);
