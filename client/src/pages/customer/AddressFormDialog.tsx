import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { z } from "zod";

import { createAddressSchema } from "@restomanager/validators";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/form/TextField";
import {
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
} from "@/hooks/customer/useCustomerAddresses";
import type { CustomerAddress } from "@/services/customer/customer.types";

const addressFormSchema = createAddressSchema;

type AddressFormValues = z.input<typeof addressFormSchema>;
type AddressFormSubmitValues = z.output<typeof addressFormSchema>;

const emptyFormValues: AddressFormValues = {
  label: "",
  city: "",
  street: "",
  building: "",
  floor: "",
  phoneNumber: "",
  isDefault: false,
};

type AddressFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog edits this address instead of creating one. */
  address?: CustomerAddress | null;
  /**
   * Called after a successful create or update, with the resulting address.
   * Lets callers (e.g. checkout) auto-select a newly added address.
   */
  onSaved?: (address: CustomerAddress) => void;
};

/**
 * RES-121: create/edit form for a customer's saved delivery address.
 * Reused by the addresses list page and the checkout address section so
 * both flows stay in sync with a single validated form.
 */
export function AddressFormDialog({
  open,
  onOpenChange,
  address = null,
  onSaved,
}: AddressFormDialogProps) {
  const isEditMode = Boolean(address);

  const createAddressMutation = useCreateCustomerAddress();
  const updateAddressMutation = useUpdateCustomerAddress();

  const isSaving =
    createAddressMutation.isPending || updateAddressMutation.isPending;

  const { control, handleSubmit, reset, watch, setValue } = useForm<
    AddressFormValues,
    unknown,
    AddressFormSubmitValues
  >({
    resolver: zodResolver(addressFormSchema),
    defaultValues: emptyFormValues,
  });

  const isDefault = watch("isDefault");

  // Reset the form whenever the dialog opens, so switching between
  // "add new" and "edit" (or reopening) always starts from clean data.
  useEffect(() => {
    if (!open) return;

    if (address) {
      reset({
        label: address.label,
        city: address.city,
        street: address.street,
        building: address.building,
        floor: address.floor,
        phoneNumber: address.phoneNumber,
        isDefault: address.isDefault,
      });
      return;
    }

    reset(emptyFormValues);
  }, [open, address, reset]);

  const onSubmit = handleSubmit((values) => {
    if (isEditMode && address) {
      updateAddressMutation.mutate(
        { addressId: address._id, payload: values },
        {
          onSuccess: (updatedAddress) => {
            onOpenChange(false);
            onSaved?.(updatedAddress);
          },
        },
      );
      return;
    }

    createAddressMutation.mutate(values, {
      onSuccess: (createdAddress) => {
        onOpenChange(false);
        onSaved?.(createdAddress);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="size-5" aria-hidden="true" />
          </div>

          <DialogTitle className="mt-3">
            {isEditMode ? "Edit address" : "Add a new address"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this delivery address."
              : "Save an address so it's ready next time you check out."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            control={control}
            name="label"
            label="Label"
            placeholder="Home, Work, Mom's place..."
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="city"
              label="City"
              placeholder="Beirut"
              required
            />

            <TextField
              control={control}
              name="phoneNumber"
              label="Phone number"
              type="tel"
              inputMode="tel"
              placeholder="+961 70 000 000"
              required
            />
          </div>

          <TextField
            control={control}
            name="street"
            label="Street"
            placeholder="Hamra Street"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="building"
              label="Building"
              placeholder="Building 12"
              required
            />

            <TextField
              control={control}
              name="floor"
              label="Floor (optional)"
              placeholder="3rd floor"
            />
          </div>

          {/* Editing the current default can't demote it here — demoting
              only happens by setting a different address as default, which
              keeps the "exactly one default" invariant obvious to the
              customer. */}
          {!(isEditMode && address?.isDefault) && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div>
                <Label htmlFor="address-is-default" className="text-sm font-medium">
                  Set as default address
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  We'll use this address first at checkout.
                </p>
              </div>

              <Switch
                id="address-is-default"
                checked={Boolean(isDefault)}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Save changes"
                  : "Save address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
