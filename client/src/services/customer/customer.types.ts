export type CustomerOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type CustomerOrderAddon = {
  name: string;
  price: number;
};

export type CustomerOrderItem = {
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedAddons?: CustomerOrderAddon[];
  removedIngredients?: string[];
  itemTotal: number;
};

export type CustomerDeliveryAddress = {
  label: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  phoneNumber: string;
};

export type CustomerOrderRestaurant = {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
};

export type CustomerOrder = {
  _id: string;
  orderCode: string;

  customerId: string;

  restaurantId: string | CustomerOrderRestaurant;

  deliveryAddress: CustomerDeliveryAddress;

  items: CustomerOrderItem[];

  subtotal: number;
  deliveryFee: number;
  totalPrice: number;

  status: CustomerOrderStatus;
  customerNote: string;

  createdAt: string;
  updatedAt: string;
};

export type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  selectedAddonNames?: string[];
  removedIngredientNames?: string[];
};

export type CreateOrderInput = {
  restaurantId: string;
  deliveryAddress: CustomerDeliveryAddress;
  items: CreateOrderItemInput[];
  customerNote?: string;
};

export type CustomerOrderHistoryParams = {
  page?: number;
  limit?: number;
  status?: "completed" | "cancelled";
};

export type CustomerOrderHistoryResponse = {
  orders: CustomerOrder[];
  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

//
// Addresses
//
export type CustomerAddress = {
  _id: string;
  userId: string;

  label: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  phoneNumber: string;

  isDefault: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerAddressInput = {
  label: string;
  city: string;
  street: string;
  building: string;
  floor?: string;
  phoneNumber: string;
  isDefault?: boolean;
};

export type UpdateCustomerAddressInput = Partial<CreateCustomerAddressInput>;
