import { useState } from "react";
import { MapPinPlus, MapPinned } from "lucide-react";

import { CustomerAccountPageHeader } from "@/components/customer/CustomerAccountPageHeader";
import { Button } from "@/components/ui/button";
import {
  useCustomerAddresses,
  useDeleteCustomerAddress,
  useSetDefaultCustomerAddress,
} from "@/hooks/customer/useCustomerAddresses";
import type { CustomerAddress } from "@/services/customer/customer.types";

import { AddressCard } from "./AddressCard";
import { AddressFormDialog } from "./AddressFormDialog";

function AddressesSkeleton() {
  return (
    <ul className="space-y-4" aria-hidden="true">
      {[1, 2].map((key) => (
        <li
          key={key}
          className="h-32 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </ul>
  );
}

function EmptyAddressesState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-background px-5 py-14 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MapPinned className="size-8" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-foreground">
        No saved addresses yet
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Save a delivery address so checkout only takes a couple of taps next
        time you order.
      </p>

      <Button size="lg" className="mt-6 rounded-xl px-6" onClick={onAddNew}>
        <MapPinPlus className="size-4" aria-hidden="true" />
        Add your first address
      </Button>
    </div>
  );
}

/**
 * AddressesPage (RES-119, RES-120)
 * ---------------------------------
 * Customer's saved delivery address book: list, add, edit, delete, and
 * set a default address. The default-address invariant itself is enforced
 * server-side; this page just surfaces it (RES-122, RES-123, RES-124).
 */
export default function AddressesPage() {
  const { data: addresses, isPending } = useCustomerAddresses();

  const setDefaultMutation = useSetDefaultCustomerAddress();
  const deleteMutation = useDeleteCustomerAddress();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<CustomerAddress | null>(null);

  // Tracks which single address is mid-mutation so only its own button
  // shows a loading state instead of every card in the list.
  const [pendingAddressId, setPendingAddressId] = useState<string | null>(
    null,
  );

  const openCreateForm = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const openEditForm = (address: CustomerAddress) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSetDefault = (addressId: string) => {
    setPendingAddressId(addressId);
    setDefaultMutation.mutate(addressId, {
      onSettled: () => setPendingAddressId(null),
    });
  };

  const handleDelete = (addressId: string) => {
    setPendingAddressId(addressId);
    deleteMutation.mutate(addressId, {
      onSettled: () => setPendingAddressId(null),
    });
  };

  return (
    <div className="space-y-6">
      <CustomerAccountPageHeader
        title="Saved Addresses"
        description="Manage the delivery addresses linked to your account."
        actions={
          addresses && addresses.length > 0 ? (
            <Button className="h-10 rounded-xl px-4" onClick={openCreateForm}>
              <MapPinPlus className="size-4" aria-hidden="true" />
              Add new address
            </Button>
          ) : undefined
        }
      />

      <div>
        {isPending ? (
          <AddressesSkeleton />
        ) : !addresses || addresses.length === 0 ? (
          <EmptyAddressesState onAddNew={openCreateForm} />
        ) : (
          <ul className="space-y-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={() => openEditForm(address)}
                onSetDefault={() => handleSetDefault(address._id)}
                onDelete={() => handleDelete(address._id)}
                isSettingDefault={
                  pendingAddressId === address._id &&
                  setDefaultMutation.isPending
                }
                isDeleting={
                  pendingAddressId === address._id && deleteMutation.isPending
                }
              />
            ))}
          </ul>
        )}
      </div>

      <AddressFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        address={editingAddress}
      />
    </div>
  );
}
