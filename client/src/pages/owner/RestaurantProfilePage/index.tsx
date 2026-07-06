import {
  useOwnerRestaurant,
  useUpdateOwnerRestaurant,
} from "@/hooks/owner/useOwnerRestaurant";
import {
  updateOwnerRestaurantSchema,
  type UpdateOwnerRestaurantFormValues,
} from "./types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BrandIdentitySection from "./BrandIdentitySection";
import GeneralInfoSection from "./GeneralInfoSection";
import ContactSection from "./ContactSection";
import AddressSection from "./AddressSection";
import OpeningHoursSection from "./OpeningHoursSection";
import RestaurantActivityCard from "./RestaurantActivityCard";
import type { OwnerRestaurantDetails } from "@/services/owner/owner.types";
import { toast } from "sonner";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { ProfileSaveBar } from "./ProfileSaveBar";
import SkeletonLoading from "./SkeletonLoading";

const initialFormValues: UpdateOwnerRestaurantFormValues = {
  name: "",
  description: "",
  cuisineTypes: [],
  logoUrl: "",
  bannerUrl: "",
  logoFile: null,
  bannerFile: null,
  contact: {
    phone: "",
    email: "",
  },
  address: {
    city: "",
    street: "",
    building: "",
    floor: "",
    locationUrl: "",
  },
  openingHours: [],
};

export default function OwnerRestaurantProfilePage() {
  const { data: restaurant, isLoading } = useOwnerRestaurant();
  const updateRestaurant = useUpdateOwnerRestaurant();

  const form = useForm<UpdateOwnerRestaurantFormValues>({
    resolver: zodResolver(updateOwnerRestaurantSchema),
    values: restaurant
      ? {
          name: restaurant.name,
          description: restaurant.description,
          cuisineTypes: restaurant.cuisineTypes,
          logoUrl: restaurant.logoUrl ?? "",
          bannerUrl: restaurant.bannerUrl ?? "",
          logoFile: null,
          bannerFile: null,
          contact: {
            phone: restaurant.contact?.phone ?? "",
            email: restaurant.contact?.email ?? "",
          },
          address: {
            city: restaurant.address?.city ?? "",
            street: restaurant.address?.street ?? "",
            building: restaurant.address?.building ?? "",
            floor: restaurant.address?.floor ?? "",
            locationUrl: restaurant.address?.locationUrl ?? "",
          },
          openingHours: restaurant.openingHours,
        }
      : initialFormValues,
  });

  const {
    formState: { isDirty },
  } = form;

  useUnsavedChangesWarning(form.formState.isDirty);

  const onSubmit = (values: UpdateOwnerRestaurantFormValues) => {
    if (!isDirty) return;

    updateRestaurant.mutate(values, {
      onSuccess: (updatedRestaurant) => {
        form.reset(mapRestaurantToFormValues(updatedRestaurant));
        toast.success("Restaurant profile updated successfully!");
      },
    });
  };

  if (isLoading) {
    return <SkeletonLoading />;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <div className="space-y-6">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BrandIdentitySection />
          <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
            <GeneralInfoSection />
            <ContactSection />
          </div>
          <AddressSection />
          <OpeningHoursSection />

          <ProfileSaveBar
            isDirty={form.formState.isDirty}
            isPending={updateRestaurant.isPending}
            onDiscard={() => {
              if (!restaurant) return;
              form.reset(mapRestaurantToFormValues(restaurant));
            }}
          />
        </form>
      </FormProvider>

      <RestaurantActivityCard isOpen={restaurant.isOpen} />
    </div>
  );
}

const mapRestaurantToFormValues = (
  restaurant: OwnerRestaurantDetails,
): UpdateOwnerRestaurantFormValues => {
  return {
    name: restaurant.name,
    description: restaurant.description,
    cuisineTypes: restaurant.cuisineTypes,
    logoUrl: restaurant.logoUrl ?? "",
    bannerUrl: restaurant.bannerUrl ?? "",
    logoFile: null,
    bannerFile: null,
    contact: {
      phone: restaurant.contact?.phone ?? "",
      email: restaurant.contact?.email ?? "",
    },
    address: {
      city: restaurant.address?.city ?? "",
      street: restaurant.address?.street ?? "",
      building: restaurant.address?.building ?? "",
      floor: restaurant.address?.floor ?? "",
      locationUrl: restaurant.address?.locationUrl ?? "",
    },
    openingHours: restaurant.openingHours,
  };
};
