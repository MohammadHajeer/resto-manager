import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PersistedRestaurantRegisterValues,
  RestaurantRegisterFormValues,
} from "../types";
import { sanitizeForPersistence } from "../types";

type RestaurantRegisterState = {
  currentStep: number;
  formValues: PersistedRestaurantRegisterValues | null;
  setCurrentStep: (step: number) => void;
  saveFormValues: (values: RestaurantRegisterFormValues) => void;
  clearRegistration: () => void;
};

export const useRestaurantRegisterStore = create<RestaurantRegisterState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formValues: null,
      setCurrentStep: (step) => set({ currentStep: step }),
      saveFormValues: (values) =>
        set({ formValues: sanitizeForPersistence(values) }),
      clearRegistration: () => set({ currentStep: 1, formValues: null }),
    }),
    {
      name: "resto-manager-restaurant-registration",
      version: 1,
      partialize: (state) => ({
        currentStep: state.currentStep,
        formValues: state.formValues,
      }),
    },
  ),
);
