import "dotenv/config";

import { createHash } from "node:crypto";
import type { Db, MongoClient, ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

import { getErrorMessage } from "./seedUtils.js";

const SHARED_PASSWORD = "password";
const SEED_NAMESPACE = "resto-manager-demo-customers-orders-v1";

const ACTIVE_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "ready",
] as const;

type ActiveStatus = (typeof ACTIVE_STATUSES)[number];

type DeliveryAddress = {
  label: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  phoneNumber: string;
};

type DemoCustomer = {
  name: string;
  email: string;
  phone: string;
  orderCount: 2 | 3 | 4;
  address: DeliveryAddress;
};

type BetterAuthUser = {
  _id: ObjectId;
  email: string;
  role?: string;
};

type Models = {
  Restaurant: (typeof import("@/modules/restaurant/restaurant.model.js"))["Restaurant"];
  MenuItem: (typeof import("@/modules/menuItem/menuItem.model.js"))["MenuItem"];
  Order: (typeof import("@/modules/orders/orders.model.js"))["Order"];
};

type Runtime = {
  auth: (typeof import("@/lib/auth.js"))["auth"];
  db: Db;
  models: Models;
};

type AvailableMenuItems = Awaited<ReturnType<typeof getAvailableMenuItems>>;

type RestaurantWithMenu = {
  restaurantId: Types.ObjectId;
  restaurantName: string;
  menuItems: AvailableMenuItems;
};

type SeedSummary = {
  customersCreated: number;
  customersSkipped: number;
  ordersCreated: number;
  ordersSkipped: number;
  restaurantsUsed: Set<string>;
  restaurantsSkipped: string[];
  createdByStatus: Record<ActiveStatus, number>;
  skippedByStatus: Record<ActiveStatus, number>;
};

const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    name: "Layla Haddad",
    email: "layla.haddad@resto-demo.com",
    phone: "+961 71 234 510",
    orderCount: 4,
    address: {
      label: "Home",
      city: "Beirut",
      street: "Bliss Street, Hamra",
      building: "Al Noor Building",
      floor: "4th floor",
      phoneNumber: "+961 71 234 510",
    },
  },
  {
    name: "Karim Nasser",
    email: "karim.nasser@resto-demo.com",
    phone: "+961 70 318 642",
    orderCount: 3,
    address: {
      label: "Office",
      city: "Beirut",
      street: "Sassine Square, Achrafieh",
      building: "Sassine Center",
      floor: "6th floor",
      phoneNumber: "+961 70 318 642",
    },
  },
  {
    name: "Nour Khoury",
    email: "nour.khoury@resto-demo.com",
    phone: "+961 76 405 731",
    orderCount: 2,
    address: {
      label: "Home",
      city: "Beirut",
      street: "Verdun Street",
      building: "Residence 732",
      floor: "8th floor",
      phoneNumber: "+961 76 405 731",
    },
  },
  {
    name: "Jad Mansour",
    email: "jad.mansour@resto-demo.com",
    phone: "+961 81 522 184",
    orderCount: 4,
    address: {
      label: "Home",
      city: "Jal El Dib",
      street: "Seaside Road",
      building: "Marina View",
      floor: "3rd floor",
      phoneNumber: "+961 81 522 184",
    },
  },
  {
    name: "Sara Daher",
    email: "sara.daher@resto-demo.com",
    phone: "+961 79 640 295",
    orderCount: 3,
    address: {
      label: "Home",
      city: "Hazmieh",
      street: "Damascus Road",
      building: "Pine Residence",
      floor: "2nd floor",
      phoneNumber: "+961 79 640 295",
    },
  },
  {
    name: "Toni Azar",
    email: "toni.azar@resto-demo.com",
    phone: "+961 3 754 306",
    orderCount: 2,
    address: {
      label: "Studio",
      city: "Baabda",
      street: "Brazilia Street",
      building: "Cedars Court",
      floor: "Ground floor",
      phoneNumber: "+961 3 754 306",
    },
  },
  {
    name: "Maya Saad",
    email: "maya.saad@resto-demo.com",
    phone: "+961 71 861 427",
    orderCount: 4,
    address: {
      label: "Home",
      city: "Jounieh",
      street: "Sarba Main Road",
      building: "Bay Tower",
      floor: "5th floor",
      phoneNumber: "+961 71 861 427",
    },
  },
  {
    name: "Rami Ghosn",
    email: "rami.ghosn@resto-demo.com",
    phone: "+961 70 972 538",
    orderCount: 3,
    address: {
      label: "Chalet",
      city: "Broummana",
      street: "Main Street",
      building: "Mountain Heights",
      floor: "1st floor",
      phoneNumber: "+961 70 972 538",
    },
  },
  {
    name: "Elie Hobeika",
    email: "elie.hobeika@resto-demo.com",
    phone: "+961 76 183 649",
    orderCount: 2,
    address: {
      label: "Office",
      city: "Sin El Fil",
      street: "Horsh Tabet Road",
      building: "Metropolitan Center",
      floor: "7th floor",
      phoneNumber: "+961 76 183 649",
    },
  },
  {
    name: "Rana Salem",
    email: "rana.salem@resto-demo.com",
    phone: "+961 81 294 750",
    orderCount: 3,
    address: {
      label: "Home",
      city: "Antelias",
      street: "St. Elie Street",
      building: "Olive Gardens",
      floor: "3rd floor",
      phoneNumber: "+961 81 294 750",
    },
  },
];

const STATUS_PLAN: ActiveStatus[] = [
  "pending",
  "preparing",
  "ready",
  "accepted",
  "pending",
  "preparing",
  "ready",
  "pending",
  "preparing",
  "accepted",
  "pending",
  "ready",
  "preparing",
  "accepted",
  "pending",
  "ready",
  "preparing",
  "pending",
  "accepted",
  "preparing",
  "ready",
  "pending",
  "preparing",
  "accepted",
  "ready",
  "pending",
  "preparing",
  "ready",
  "accepted",
  "pending",
];

const CUSTOMER_NOTES = [
  "Please call when you arrive.",
  "Kindly include napkins and cutlery.",
  "The building entrance is beside the pharmacy.",
  "Please ring the intercom once.",
  "Leave the order with reception if needed.",
] as const;

const emptyStatusCounts = (): Record<ActiveStatus, number> => ({
  pending: 0,
  accepted: 0,
  preparing: 0,
  ready: 0,
});

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateSeedDataset() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo customer/order seed refused to run in production.");
  }
  if (SHARED_PASSWORD !== "password") {
    throw new Error("The shared demo password must be exactly 'password'.");
  }
  if (DEMO_CUSTOMERS.length !== 10) {
    throw new Error(`Expected exactly 10 demo customers, found ${DEMO_CUSTOMERS.length}.`);
  }

  const emails = new Set(DEMO_CUSTOMERS.map((customer) => customer.email));
  const phones = new Set(DEMO_CUSTOMERS.map((customer) => customer.phone));
  if (emails.size !== DEMO_CUSTOMERS.length) {
    throw new Error("Demo customer emails must be unique.");
  }
  if (phones.size !== DEMO_CUSTOMERS.length) {
    throw new Error("Demo customer phone numbers must be unique.");
  }
  if (DEMO_CUSTOMERS.some((customer) => !customer.email.endsWith("@resto-demo.com"))) {
    throw new Error("Every demo customer email must use the @resto-demo.com domain.");
  }

  const plannedOrderCount = DEMO_CUSTOMERS.reduce(
    (total, customer) => total + customer.orderCount,
    0,
  );
  if (STATUS_PLAN.length !== plannedOrderCount) {
    throw new Error(
      `Status plan has ${STATUS_PLAN.length} entries for ${plannedOrderCount} planned orders.`,
    );
  }
}

function deterministicOrderId(email: string, orderIndex: number) {
  const hex = createHash("sha256")
    .update(`${SEED_NAMESPACE}:${email}:${orderIndex}`)
    .digest("hex")
    .slice(0, 24);
  return new Types.ObjectId(hex);
}

function trackSessionToken(result: unknown, sessionTokens: string[]) {
  if (
    result &&
    typeof result === "object" &&
    "token" in result &&
    typeof result.token === "string"
  ) {
    sessionTokens.push(result.token);
  }
}

async function getAvailableMenuItems(
  MenuItem: Models["MenuItem"],
  restaurantId: Types.ObjectId,
) {
  return MenuItem.find({
    restaurantId,
    isAvailable: true,
    deletedAt: null,
  })
    .sort({ name: 1, _id: 1 })
    .exec();
}

async function loadEligibleRestaurants(models: Models, summary: SeedSummary) {
  const approvedRestaurants = await models.Restaurant.find({ status: "approved" })
    .sort({ slug: 1, _id: 1 })
    .exec();

  if (approvedRestaurants.length === 0) {
    throw new Error("No approved restaurants were found; no demo orders can be seeded.");
  }

  const eligibleRestaurants: RestaurantWithMenu[] = [];
  for (const restaurant of approvedRestaurants) {
    const menuItems = await getAvailableMenuItems(models.MenuItem, restaurant._id);
    if (menuItems.length === 0) {
      summary.restaurantsSkipped.push(restaurant.name);
      console.warn(
        `Skipping restaurant '${restaurant.name}': no available, non-deleted menu items.`,
      );
      continue;
    }

    eligibleRestaurants.push({
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      menuItems,
    });
  }

  if (eligibleRestaurants.length === 0) {
    throw new Error(
      "Approved restaurants exist, but none has available, non-deleted menu items.",
    );
  }

  return eligibleRestaurants;
}

async function seedCustomers(
  runtime: Runtime,
  sessionTokens: string[],
  summary: SeedSummary,
) {
  const usersByEmail = new Map<string, Types.ObjectId>();
  const userCollection = runtime.db.collection<BetterAuthUser>("user");

  for (const customer of DEMO_CUSTOMERS) {
    let user = await userCollection.findOne({ email: customer.email });
    let created = false;

    if (!user) {
      const signUpResult = await runtime.auth.api.signUpEmail({
        body: {
          name: customer.name,
          email: customer.email,
          password: SHARED_PASSWORD,
          phone: customer.phone,
        },
      });
      trackSessionToken(signUpResult, sessionTokens);
      user = await userCollection.findOne({ email: customer.email });
      created = true;
    }

    if (!user?._id || typeof user._id.toHexString !== "function") {
      throw new Error(`Better Auth did not provide a valid ObjectId for ${customer.email}.`);
    }

    if (created && user.role !== "customer") {
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { role: "customer", updatedAt: new Date() } },
      );
      user.role = "customer";
    }

    if (user.role !== "customer") {
      throw new Error(
        `Existing demo user ${customer.email} has role '${user.role ?? "unset"}'; it was not modified.`,
      );
    }

    usersByEmail.set(customer.email, new Types.ObjectId(user._id.toHexString()));
    if (created) {
      summary.customersCreated += 1;
      console.log(`Created customer: ${customer.email}`);
    } else {
      summary.customersSkipped += 1;
      console.log(`Skipped existing customer: ${customer.email}`);
    }
  }

  return usersByEmail;
}

function buildOrderItems(
  restaurant: RestaurantWithMenu,
  customerIndex: number,
  customerOrderIndex: number,
  globalOrderIndex: number,
) {
  const lineItemCount = Math.min(
    restaurant.menuItems.length,
    1 + ((customerIndex + customerOrderIndex * 2) % 4),
  );
  const startIndex = (globalOrderIndex * 3) % restaurant.menuItems.length;

  return Array.from({ length: lineItemCount }, (_, lineIndex) => {
    const menuItem =
      restaurant.menuItems[(startIndex + lineIndex) % restaurant.menuItems.length];
    const quantitySeed = (globalOrderIndex + lineIndex * 2) % 12;
    const quantity = quantitySeed === 0 ? 3 : quantitySeed <= 4 ? 2 : 1;
    const shouldSelectAddon =
      menuItem.availableAddons.length > 0 &&
      (globalOrderIndex + lineIndex) % 3 === 0;
    const selectedAddon = shouldSelectAddon
      ? menuItem.availableAddons[
          (globalOrderIndex + lineIndex) % menuItem.availableAddons.length
        ]
      : undefined;
    const selectedAddons = selectedAddon
      ? [{ name: selectedAddon.name, price: selectedAddon.price }]
      : [];
    const addonsTotal = selectedAddons.reduce(
      (total, addon) => total + addon.price,
      0,
    );
    const itemTotal = (menuItem.price + addonsTotal) * quantity;

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      basePrice: menuItem.price,
      quantity,
      selectedAddons,
      itemTotal,
    };
  });
}

function orderTimestamps(
  now: Date,
  customerIndex: number,
  customerOrderIndex: number,
  status: ActiveStatus,
) {
  const ageHours = 2 + ((customerIndex * 11 + customerOrderIndex * 7) % 70);
  const ageMinutes = (customerIndex * 13 + customerOrderIndex * 17) % 60;
  const createdAt = new Date(
    now.getTime() - (ageHours * 60 + ageMinutes) * 60 * 1000,
  );
  const progressMinutes: Record<ActiveStatus, number> = {
    pending: 4,
    accepted: 18,
    preparing: 42,
    ready: 68,
  };
  const updatedAt = new Date(
    createdAt.getTime() + progressMinutes[status] * 60 * 1000,
  );
  return { createdAt, updatedAt };
}

async function seedOrders(
  runtime: Runtime,
  usersByEmail: Map<string, Types.ObjectId>,
  restaurants: RestaurantWithMenu[],
  summary: SeedSummary,
) {
  const now = new Date();
  let globalOrderIndex = 0;

  for (const [customerIndex, customer] of DEMO_CUSTOMERS.entries()) {
    const customerId = usersByEmail.get(customer.email);
    if (!customerId) {
      throw new Error(`Missing seeded Better Auth user for ${customer.email}.`);
    }

    for (
      let customerOrderIndex = 0;
      customerOrderIndex < customer.orderCount;
      customerOrderIndex += 1
    ) {
      const status = STATUS_PLAN[globalOrderIndex];
      const restaurant = restaurants[globalOrderIndex % restaurants.length];
      const orderId = deterministicOrderId(customer.email, customerOrderIndex);
      const existingOrder = await runtime.models.Order.findById(orderId).exec();

      if (existingOrder) {
        if (
          String(existingOrder.customerId) !== String(customerId) ||
          String(existingOrder.restaurantId) !== String(restaurant.restaurantId)
        ) {
          throw new Error(
            `Deterministic order id collision detected for ${customer.email} order ${customerOrderIndex + 1}.`,
          );
        }
        summary.ordersSkipped += 1;
        summary.skippedByStatus[status] += 1;
        summary.restaurantsUsed.add(restaurant.restaurantName);
        console.log(`Skipped existing order: ${customer.email} #${customerOrderIndex + 1}`);
        globalOrderIndex += 1;
        continue;
      }

      const items = buildOrderItems(
        restaurant,
        customerIndex,
        customerOrderIndex,
        globalOrderIndex,
      );
      const subtotal = items.reduce((total, item) => total + item.itemTotal, 0);
      const deliveryFee = 0;
      const totalPrice = subtotal + deliveryFee;
      const customerNote =
        globalOrderIndex % 3 === 0
          ? CUSTOMER_NOTES[globalOrderIndex % CUSTOMER_NOTES.length]
          : "";
      const { createdAt, updatedAt } = orderTimestamps(
        now,
        customerIndex,
        customerOrderIndex,
        status,
      );

      const order = new runtime.models.Order({
        _id: orderId,
        customerId,
        restaurantId: restaurant.restaurantId,
        deliveryAddress: customer.address,
        items,
        subtotal,
        deliveryFee,
        totalPrice,
        status,
        customerNote,
        createdAt,
        updatedAt,
      });
      await order.save({ timestamps: false });

      summary.ordersCreated += 1;
      summary.createdByStatus[status] += 1;
      summary.restaurantsUsed.add(restaurant.restaurantName);
      console.log(
        `Created ${status} order: ${customer.email} -> ${restaurant.restaurantName}`,
      );
      globalOrderIndex += 1;
    }
  }
}

function printCredentials() {
  console.log("\nDemo customer credentials");
  for (const customer of DEMO_CUSTOMERS) {
    console.log(`- ${customer.email}`);
  }
  console.log(`Shared password: ${SHARED_PASSWORD}`);
}

function printSummary(summary: SeedSummary) {
  console.log("\nSeed summary");
  console.log(`Customers created: ${summary.customersCreated}`);
  console.log(`Customers skipped: ${summary.customersSkipped}`);
  console.log(`Orders created: ${summary.ordersCreated}`);
  console.log(`Orders skipped: ${summary.ordersSkipped}`);
  console.log(`Restaurants used: ${[...summary.restaurantsUsed].join(", ")}`);
  console.log(
    `Restaurants skipped (no valid menu items): ${summary.restaurantsSkipped.join(", ") || "none"}`,
  );
  console.log("Orders created by status:");
  for (const status of ACTIVE_STATUSES) {
    console.log(`- ${status}: ${summary.createdByStatus[status]}`);
  }
  console.log("Orders skipped by status:");
  for (const status of ACTIVE_STATUSES) {
    console.log(`- ${status}: ${summary.skippedByStatus[status]}`);
  }
  printCredentials();
}

async function main() {
  validateSeedDataset();
  const mongoUri = requireEnvironmentVariable("MONGO_URI");
  requireEnvironmentVariable("BETTER_AUTH_SECRET");
  requireEnvironmentVariable("BETTER_AUTH_URL");

  const summary: SeedSummary = {
    customersCreated: 0,
    customersSkipped: 0,
    ordersCreated: 0,
    ordersSkipped: 0,
    restaurantsUsed: new Set<string>(),
    restaurantsSkipped: [],
    createdByStatus: emptyStatusCounts(),
    skippedByStatus: emptyStatusCounts(),
  };
  const sessionTokens: string[] = [];
  let authClient: MongoClient | undefined;
  let authDb: Db | undefined;

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    const [authModule, restaurantModule, menuItemModule, orderModule] =
      await Promise.all([
        import("@/lib/auth.js"),
        import("@/modules/restaurant/restaurant.model.js"),
        import("@/modules/menuItem/menuItem.model.js"),
        import("@/modules/orders/orders.model.js"),
      ]);
    authClient = authModule.authMongoClient;
    authDb = authModule.authDb;
    await authClient.connect();

    const runtime: Runtime = {
      auth: authModule.auth,
      db: authDb,
      models: {
        Restaurant: restaurantModule.Restaurant,
        MenuItem: menuItemModule.MenuItem,
        Order: orderModule.Order,
      },
    };

    const restaurants = await loadEligibleRestaurants(runtime.models, summary);
    console.log(
      `Eligible restaurants: ${restaurants
        .map((restaurant) => `${restaurant.restaurantName} (${restaurant.menuItems.length} items)`)
        .join(", ")}`,
    );

    const usersByEmail = await seedCustomers(runtime, sessionTokens, summary);
    await seedOrders(runtime, usersByEmail, restaurants, summary);
    printSummary(summary);
  } catch (error) {
    console.error(`Customer/order seed failed: ${getErrorMessage(error)}`);
    process.exitCode = 1;
  } finally {
    if (authDb && sessionTokens.length > 0) {
      await authDb
        .collection("session")
        .deleteMany({ token: { $in: sessionTokens } })
        .catch((error: unknown) => {
          console.warn(`Unable to remove seed sessions: ${getErrorMessage(error)}`);
        });
    }
    await authClient?.close().catch(() => undefined);
    await mongoose.disconnect().catch(() => undefined);
  }
}

await main();
