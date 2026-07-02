import type { Control } from "react-hook-form";
import { TextField } from "../../../../components/form/TextField";
import { TextareaField } from "../../../../components/form/TextareaField";
import type { RestaurantRegisterFormValues } from "../types";

type RestaurantDetailsStepProps = {
  control: Control<RestaurantRegisterFormValues>;
};

export function RestaurantDetailsStep({ control }: RestaurantDetailsStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground">
          Tell us about your restaurant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This information will be displayed to customers on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          <TextField
            control={control}
            name="restaurant.name"
            label="Restaurant Legal Name"
            placeholder="Gourmet Bistro Inc."
            className="md:col-span-2"
            required
          />
          <TextareaField
            control={control}
            name="restaurant.description"
            label="Restaurant Description"
            placeholder="Describe your food, atmosphere, and service style."
            className="md:col-span-2"
            required
          />
          <TextField
            control={control}
            name="restaurant.cuisineTypes.0"
            label="Cuisine Type"
            placeholder="e.g., Italian, Fusion, Vegan"
            required
          />
          <TextField
            control={control}
            name="contact.phone"
            type="tel"
            label="Restaurant Phone"
            placeholder="+1 (555) 111-2222"
            required
          />
          <TextField
            control={control}
            name="contact.email"
            type="email"
            label="Restaurant Email"
            placeholder="hello@restaurant.com"
          />
          <TextField
            control={control}
            name="address.city"
            label="City"
            placeholder="New York"
            required
          />
          <TextField
            control={control}
            name="address.street"
            label="Street"
            placeholder="123 Culinary Ave"
            required
          />
          <TextField
            control={control}
            name="address.building"
            label="Building"
            placeholder="Building A"
            required
          />
          <TextField
            control={control}
            name="address.floor"
            label="Floor"
            placeholder="Ground floor"
          />
          <TextField
            control={control}
            name="address.locationUrl"
            type="url"
            label="Location URL"
            placeholder="https://maps.example.com/your-location"
          />
      </div>
    </section>
  );
}
