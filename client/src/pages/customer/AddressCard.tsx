import { useState } from "react";
import { MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { CustomerAddress } from "@/services/customer/customer.types";

type AddressCardProps = {
  address: CustomerAddress;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
  isSettingDefault?: boolean;
  isDeleting?: boolean;
};

/** RES-120: a single saved address in the customer's address book. */
export function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  isSettingDefault = false,
  isDeleting = false,
}: AddressCardProps) {
  // AlertDialogAction (unlike Cancel) doesn't auto-close the dialog, so we
  // control it locally and close it right when the delete is confirmed.
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <li
      className={`flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors sm:flex-row sm:items-start sm:justify-between ${
        address.isDefault ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-4.5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{address.label}</p>

            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                <Star className="size-3" aria-hidden="true" />
                Default
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {address.building}, {address.street}
            {address.floor ? `, ${address.floor}` : ""}
            <br />
            {address.city}
          </p>

          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="size-3.5" aria-hidden="true" />
            {address.phoneNumber}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
        {!address.isDefault && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSetDefault}
            disabled={isSettingDefault}
            className="justify-center"
          >
            {isSettingDefault ? "Setting..." : "Set as default"}
          </Button>
        )}

        <div className="flex items-center gap-2 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${address.label}`}
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </Button>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${address.label}`}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                />
              }
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this address?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{address.label}" will be permanently removed from your
                  saved addresses.
                  {address.isDefault &&
                    " Since it's your default, another address will automatically become the default."}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    onDelete();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </li>
  );
}
