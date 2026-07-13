import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { ObjectId, type Db, type MongoClient } from "mongodb";
import {
  createCategorySchema,
  createMenuItemSchema,
  restaurantProfileUpdateSchema,
  restaurantRegistrationSchema,
} from "@restomanager/validators";
import {
  OPENING_HOURS,
  REMOTE_IMAGE_URLS,
  SEED_PASSWORD,
  SEED_RESTAURANTS,
  type SeedRestaurant,
} from "./seedData.js";
import { createVerificationPdf } from "./seedDocuments.js";
import { createSlug } from "@/utils/createSlug.js";
import {
  assertSeedFileMatchesMetadata,
  getErrorMessage,
  mapWithConcurrency,
  type SeedFile,
} from "./seedUtils.js";

const RESET_WARNING =
  "WARNING: This command will permanently delete all data from the configured MongoDB database and all files from the configured RestoManager Supabase buckets.";
const RESET_REQUESTED = process.argv.includes("--reset");

type SeedRole = "admin" | "customer" | "restaurant_owner";
type SeedAccount = {
  name: string;
  email: string;
  phone: string;
  role: SeedRole;
};
type UploadedFile = {
  bucket: string;
  path: string;
  kind: "logo" | "banner" | "menu-item" | "verification";
};
type PreparedRestaurant = {
  seed: SeedRestaurant;
  logo: SeedFile;
  banner: Awaited<
    ReturnType<(typeof import("./seedImages.js"))["getSeedImage"]>
  >;
  businessPdf: SeedFile;
  ownerPdf: SeedFile;
  paths: {
    logo: string;
    banner: string;
    businessLicense: string;
    ownerIdentification: string;
  };
  menuMedia: Array<{
    itemSlug: string;
    itemName: string;
    path: string;
    image: Awaited<
      ReturnType<(typeof import("./seedImages.js"))["getSeedImage"]>
    >;
  }>;
};
type Models = {
  Restaurant: (typeof import("@/modules/restaurant/restaurant.model.js"))["Restaurant"];
  Category: (typeof import("@/modules/category/category.model.js"))["Category"];
  MenuItem: (typeof import("@/modules/menuItem/menuItem.model.js"))["MenuItem"];
};
type SeedContext = {
  createdUserIds: ObjectId[];
  createdRestaurantIds: Types.ObjectId[];
  createdCategoryIds: Types.ObjectId[];
  createdMenuItemIds: Types.ObjectId[];
  uploadedFiles: UploadedFile[];
  sessionTokens: string[];
};
type Runtime = {
  auth: (typeof import("@/lib/auth.js"))["auth"];
  db: Db;
  client: MongoClient;
  models: Models;
  images: typeof import("./seedImages.js");
  reset: typeof import("./seedReset.js");
  publicBucket: string;
  privateBucket: string;
};

const BASE_ACCOUNTS: SeedAccount[] = [
  {
    name: "RestoManager Administrator",
    email: "admin@resto.com",
    phone: "+961 1 000 001",
    role: "admin",
  },
  {
    name: "RestoManager Customer",
    email: "customer@resto.com",
    phone: "+961 1 000 002",
    role: "customer",
  },
];
const SEED_ACCOUNTS: SeedAccount[] = [
  ...BASE_ACCOUNTS,
  ...SEED_RESTAURANTS.map((restaurant) => ({
    ...restaurant.owner,
    role: "restaurant_owner" as const,
  })),
];
const context: SeedContext = {
  createdUserIds: [],
  createdRestaurantIds: [],
  createdCategoryIds: [],
  createdMenuItemIds: [],
  uploadedFiles: [],
  sessionTokens: [],
};

let runtime: Runtime | undefined;
let resetCleanupCompleted = false;
let reseedingStarted = false;

function validateExecutionPermission() {
  console.log("Validating reset permissions...");

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Development seed refused to run because NODE_ENV is production.",
    );
  }

  if (!RESET_REQUESTED) {
    console.log(
      "Normal seed mode: existing data and storage will not be cleared.",
    );
    return true;
  }

  console.warn(RESET_WARNING);
  if (process.env.ALLOW_DATABASE_RESET !== "true") {
    console.warn(
      "Reset skipped: set ALLOW_DATABASE_RESET=true and use the --reset command to authorize deletion.",
    );
    return false;
  }

  return true;
}

function requireEnvironment() {
  const required = [
    "MONGO_URI",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_PUBLIC_BUCKET",
    "SUPABASE_PRIVATE_BUCKET",
  ] as const;
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required seed environment variables: ${missing.join(", ")}`,
    );
  }

  return {
    publicBucket: process.env.SUPABASE_PUBLIC_BUCKET!,
    privateBucket: process.env.SUPABASE_PRIVATE_BUCKET!,
  };
}

function validateSeedDataset() {
  if (SEED_PASSWORD !== "password") {
    throw new Error("Development seed password must be exactly 'password'");
  }
  if (SEED_ACCOUNTS.length !== 7) {
    throw new Error(`Expected 7 seed accounts, found ${SEED_ACCOUNTS.length}`);
  }

  const emails = new Set<string>();
  const slugs = new Set<string>();
  for (const account of SEED_ACCOUNTS) {
    if (emails.has(account.email)) {
      throw new Error(`Duplicate seed account email: ${account.email}`);
    }
    emails.add(account.email);
  }

  for (const seed of SEED_RESTAURANTS) {
    if (slugs.has(seed.slug)) {
      throw new Error(`Duplicate seed restaurant slug: ${seed.slug}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seed.slug)) {
      throw new Error(`Invalid seed restaurant slug: ${seed.slug}`);
    }
    slugs.add(seed.slug);

    restaurantRegistrationSchema.parse({
      owner: {
        ...seed.owner,
        password: SEED_PASSWORD,
        confirmPassword: SEED_PASSWORD,
      },
      restaurant: {
        name: seed.name,
        slug: seed.slug,
        description: seed.description,
        cuisineTypes: seed.cuisineTypes,
      },
      contact: seed.contact,
      address: seed.address,
      branding: { logo: null, banner: null },
      verification: { businessLicense: null, ownerIdDocument: null },
    });
    restaurantProfileUpdateSchema.parse({
      openingHours:
        seed.slug === "good-day-kitchen"
          ? OPENING_HOURS.cafe
          : OPENING_HOURS.dining,
    });

    const itemSlugs = new Set<string>();
    for (const category of seed.categories) {
      createCategorySchema.parse({
        name: category.name,
        description: category.description,
        isActive: true,
      });
      for (const item of category.items) {
        const itemSlug = createSlug(item.name);
        if (itemSlugs.has(itemSlug)) {
          throw new Error(
            `Duplicate menu-item slug '${itemSlug}' in ${seed.name}`,
          );
        }
        itemSlugs.add(itemSlug);
        createMenuItemSchema.parse({
          restaurantId: new Types.ObjectId().toString(),
          categoryId: new Types.ObjectId().toString(),
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: "https://seed.invalid/image.png",
          ingredients: item.ingredients,
          availableAddons: item.availableAddons,
          isAvailable: item.isAvailable ?? true,
        });
      }
    }
  }

  for (const url of Object.values(REMOTE_IMAGE_URLS)) {
    if (new URL(url).protocol !== "https:") {
      throw new Error(`Seed image source must use HTTPS: ${url}`);
    }
  }
}

async function prepareRestaurants(
  images: typeof import("./seedImages.js"),
): Promise<PreparedRestaurant[]> {
  validateSeedDataset();
  return mapWithConcurrency(SEED_RESTAURANTS, 2, async (seed) => {
    const logo = images.createRestaurantLogo(seed);
    assertSeedFileMatchesMetadata(logo);
    if (logo.extension !== ".png" || logo.contentType !== "image/png") {
      throw new Error(`Logo generator did not produce PNG for ${seed.name}`);
    }

    const seedDate = new Date();
    const businessPdf = createVerificationPdf({
      restaurantName: seed.name,
      ownerName: seed.owner.name,
      documentType: "Business License",
      seedDate,
    });
    const ownerPdf = createVerificationPdf({
      restaurantName: seed.name,
      ownerName: seed.owner.name,
      documentType: "Owner Identification",
      seedDate,
    });
    assertSeedFileMatchesMetadata(businessPdf);
    assertSeedFileMatchesMetadata(ownerPdf);

    const banner = await images.getSeedImage(
      seed.bannerKind,
      `${seed.name} banner`,
    );
    assertSeedFileMatchesMetadata(banner.file);
    const bannerPath = `restaurants/${seed.slug}/branding/banner${banner.file.extension}`;

    const menuMedia = await mapWithConcurrency(
      seed.categories.flatMap((category) => category.items),
      4,
      async (item) => {
        const image = await images.getSeedImage(item.imageKind, item.name);
        assertSeedFileMatchesMetadata(image.file);
        return {
          itemSlug: createSlug(item.name),
          itemName: item.name,
          path: images.menuImagePath(
            seed.slug,
            item.name,
            image.file.extension,
          ),
          image,
        };
      },
    );

    return {
      seed,
      logo,
      banner,
      businessPdf,
      ownerPdf,
      paths: {
        logo: `restaurants/${seed.slug}/branding/logo.png`,
        banner: bannerPath,
        businessLicense: `restaurants/${seed.slug}/verification/business-license.pdf`,
        ownerIdentification: `restaurants/${seed.slug}/verification/owner-identification.pdf`,
      },
      menuMedia,
    };
  });
}

function trackSessionToken(result: unknown) {
  if (
    result &&
    typeof result === "object" &&
    "token" in result &&
    typeof result.token === "string"
  ) {
    context.sessionTokens.push(result.token);
  }
}

async function createAndVerifyAccounts(auth: Runtime["auth"], db: Db) {
  console.log("Creating authentication accounts...");
  const usersByEmail = new Map<string, ObjectId>();
  let created = 0;

  for (const account of SEED_ACCOUNTS) {
    let user = await db.collection("user").findOne({ email: account.email });
    if (!user) {
      const signUp = await auth.api.signUpEmail({
        body: {
          name: account.name,
          email: account.email,
          password: SEED_PASSWORD,
          phone: account.phone,
        },
      });
      trackSessionToken(signUp);
      user = await db.collection("user").findOne({ email: account.email });
      if (!user?._id || !(user._id instanceof ObjectId)) {
        throw new Error(
          `Better Auth did not create a valid user for ${account.email}`,
        );
      }
      context.createdUserIds.push(user._id);
      created += 1;
    }

    if (!user._id || !(user._id instanceof ObjectId)) {
      throw new Error(`Invalid Better Auth user id for ${account.email}`);
    }

    const signIn = await auth.api.signInEmail({
      body: { email: account.email, password: SEED_PASSWORD },
    });
    trackSessionToken(signIn);
    await db.collection("user").updateOne(
      { _id: user._id },
      {
        $set: {
          role: account.role,
          name: account.name,
          phone: account.phone,
          updatedAt: new Date(),
        },
      },
    );
    usersByEmail.set(account.email, user._id);
  }

  return { usersByEmail, created, reused: SEED_ACCOUNTS.length - created };
}

async function isCompletedRestaurant(
  prepared: PreparedRestaurant,
  ownerId: ObjectId,
  services: Runtime,
) {
  const { Restaurant, Category, MenuItem } = services.models;
  const restaurant = await Restaurant.findOne({
    slug: prepared.seed.slug,
  }).lean();
  if (!restaurant) return false;

  const expectedCategorySlugs = prepared.seed.categories
    .map((category) => createSlug(category.name))
    .sort();
  const actualCategorySlugs = (
    await Category.find({ restaurantId: restaurant._id }).distinct("slug")
  ).sort();
  const menuItems = await MenuItem.find({
    restaurantId: restaurant._id,
    deletedAt: null,
  })
    .select({ slug: 1, imageUrl: 1 })
    .lean();
  const expectedItems = prepared.menuMedia
    .map((media) => media.itemSlug)
    .sort();
  const actualItems = menuItems.map((item) => item.slug).sort();
  const same = (left: string[], right: string[]) =>
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
  const expectedImageBySlug = new Map(
    prepared.menuMedia.map((media) => [
      media.itemSlug,
      services.images.publicUrlFor(services.publicBucket, media.path),
    ]),
  );

  if (
    String(restaurant.ownerId) !== String(ownerId) ||
    restaurant.name !== prepared.seed.name ||
    restaurant.logoUrl !==
      services.images.publicUrlFor(
        services.publicBucket,
        prepared.paths.logo,
      ) ||
    restaurant.bannerUrl !==
      services.images.publicUrlFor(
        services.publicBucket,
        prepared.paths.banner,
      ) ||
    restaurant.verification?.businessLicensePath !==
      prepared.paths.businessLicense ||
    restaurant.verification?.ownerIdDocumentPath !==
      prepared.paths.ownerIdentification ||
    !same(actualCategorySlugs, expectedCategorySlugs) ||
    !same(actualItems, expectedItems) ||
    menuItems.some(
      (item) => item.imageUrl !== expectedImageBySlug.get(item.slug),
    )
  ) {
    throw new Error(
      `Existing restaurant '${prepared.seed.slug}' is incomplete or differs from the fixed seed dataset; it was left unchanged`,
    );
  }

  const requiredFiles = [
    { bucket: services.publicBucket, path: prepared.paths.logo },
    { bucket: services.publicBucket, path: prepared.paths.banner },
    ...prepared.menuMedia.map((media) => ({
      bucket: services.publicBucket,
      path: media.path,
    })),
    { bucket: services.privateBucket, path: prepared.paths.businessLicense },
    {
      bucket: services.privateBucket,
      path: prepared.paths.ownerIdentification,
    },
  ];
  await mapWithConcurrency(requiredFiles, 5, async (file) => {
    if (!(await services.images.pathExists(file.bucket, file.path))) {
      throw new Error(
        `Existing restaurant '${prepared.seed.slug}' is missing ${file.bucket}/${file.path}`,
      );
    }
  });
  return true;
}

async function createRestaurantRecords(
  preparedRestaurants: PreparedRestaurant[],
  ownerIds: Map<string, ObjectId>,
  services: Runtime,
) {
  console.log("Creating restaurants...");
  const newRestaurants: Array<{
    prepared: PreparedRestaurant;
    restaurantId: Types.ObjectId;
  }> = [];
  let reused = 0;

  for (const prepared of preparedRestaurants) {
    const ownerId = ownerIds.get(prepared.seed.owner.email);
    if (!ownerId) {
      throw new Error(`Missing owner account for ${prepared.seed.name}`);
    }
    if (await isCompletedRestaurant(prepared, ownerId, services)) {
      reused += 1;
      continue;
    }

    const seedDate = new Date();
    const seed = prepared.seed;
    const restaurant = new services.models.Restaurant({
      ownerId: new Types.ObjectId(ownerId.toHexString()),
      name: seed.name,
      slug: seed.slug,
      description: seed.description,
      cuisineTypes: seed.cuisineTypes,
      logoUrl: services.images.publicUrlFor(
        services.publicBucket,
        prepared.paths.logo,
      ),
      bannerUrl: services.images.publicUrlFor(
        services.publicBucket,
        prepared.paths.banner,
      ),
      contact: seed.contact,
      address: seed.address,
      openingHours:
        seed.slug === "good-day-kitchen"
          ? OPENING_HOURS.cafe
          : OPENING_HOURS.dining,
      status: seed.status,
      isOpen: seed.status === "approved" && seed.isOpen,
      verification: {
        businessLicensePath: prepared.paths.businessLicense,
        ownerIdDocumentPath: prepared.paths.ownerIdentification,
        submittedAt: seedDate,
        reviewedAt: seed.status === "pending" ? null : seedDate,
        reviewedBy: seed.status === "pending" ? null : "development-seed",
        rejectionReason: seed.rejectionReason ?? null,
        suspensionReason: seed.suspensionReason ?? null,
      },
    });
    await restaurant.save();
    context.createdRestaurantIds.push(restaurant._id);
    newRestaurants.push({ prepared, restaurantId: restaurant._id });
  }

  return { newRestaurants, reused };
}

async function createCategoriesAndMenuItems(
  newRestaurants: Array<{
    prepared: PreparedRestaurant;
    restaurantId: Types.ObjectId;
  }>,
  services: Runtime,
) {
  console.log("Creating categories...");
  const categoryRecords: Array<{
    prepared: PreparedRestaurant;
    restaurantId: Types.ObjectId;
    categorySeed: SeedRestaurant["categories"][number];
    categoryId: Types.ObjectId;
  }> = [];

  for (const entry of newRestaurants) {
    for (const categorySeed of entry.prepared.seed.categories) {
      const category = new services.models.Category({
        restaurantId: entry.restaurantId,
        slug: createSlug(categorySeed.name),
        name: categorySeed.name,
        description: categorySeed.description,
        isActive: true,
      });
      await category.save();
      context.createdCategoryIds.push(category._id);
      categoryRecords.push({
        ...entry,
        categorySeed,
        categoryId: category._id,
      });
    }
  }

  console.log("Creating menu items...");
  for (const entry of categoryRecords) {
    const imageBySlug = new Map(
      entry.prepared.menuMedia.map((media) => [media.itemSlug, media.path]),
    );
    for (const itemSeed of entry.categorySeed.items) {
      const itemSlug = createSlug(itemSeed.name);
      const imagePath = imageBySlug.get(itemSlug);
      if (!imagePath) {
        throw new Error(`Missing prepared image for ${itemSeed.name}`);
      }
      const values = createMenuItemSchema.parse({
        restaurantId: String(entry.restaurantId),
        categoryId: String(entry.categoryId),
        name: itemSeed.name,
        description: itemSeed.description,
        price: itemSeed.price,
        imageUrl: services.images.publicUrlFor(
          services.publicBucket,
          imagePath,
        ),
        ingredients: itemSeed.ingredients,
        availableAddons: itemSeed.availableAddons,
        isAvailable: itemSeed.isAvailable ?? true,
      });
      const menuItem = new services.models.MenuItem({
        ...values,
        restaurantId: entry.restaurantId,
        categoryId: entry.categoryId,
        slug: itemSlug,
        deletedAt: null,
      });
      await menuItem.save();
      context.createdMenuItemIds.push(menuItem._id);
    }
  }
}

async function uploadFile(
  services: Runtime,
  bucket: string,
  path: string,
  file: SeedFile,
  kind: UploadedFile["kind"],
) {
  await services.images.uploadSeedFile(bucket, path, file);
  context.uploadedFiles.push({ bucket, path, kind });
}

async function uploadPreparedFiles(
  newRestaurants: Array<{ prepared: PreparedRestaurant }>,
  services: Runtime,
) {
  console.log("Uploading media...");
  for (const { prepared } of newRestaurants) {
    await uploadFile(
      services,
      services.publicBucket,
      prepared.paths.logo,
      prepared.logo,
      "logo",
    );
    await uploadFile(
      services,
      services.publicBucket,
      prepared.paths.banner,
      prepared.banner.file,
      "banner",
    );
    for (const media of prepared.menuMedia) {
      await uploadFile(
        services,
        services.publicBucket,
        media.path,
        media.image.file,
        "menu-item",
      );
    }
  }

  console.log("Uploading verification documents...");
  for (const { prepared } of newRestaurants) {
    await uploadFile(
      services,
      services.privateBucket,
      prepared.paths.businessLicense,
      prepared.businessPdf,
      "verification",
    );
    await uploadFile(
      services,
      services.privateBucket,
      prepared.paths.ownerIdentification,
      prepared.ownerPdf,
      "verification",
    );
  }
}

async function verifyFinalSeed(
  preparedRestaurants: PreparedRestaurant[],
  usersByEmail: Map<string, ObjectId>,
  services: Runtime,
) {
  const seededUsers = await services.db
    .collection("user")
    .find({ email: { $in: SEED_ACCOUNTS.map((account) => account.email) } })
    .toArray();
  if (seededUsers.length !== SEED_ACCOUNTS.length) {
    throw new Error(
      `Final verification found ${seededUsers.length} of ${SEED_ACCOUNTS.length} users`,
    );
  }
  for (const account of SEED_ACCOUNTS) {
    const user = seededUsers.find(
      (candidate) => candidate.email === account.email,
    );
    if (!user || user.role !== account.role) {
      throw new Error(`Final role verification failed for ${account.email}`);
    }
  }

  const userIds = [...usersByEmail.values()];
  const credentialAccounts = await services.db
    .collection("account")
    .find({ userId: { $in: userIds }, providerId: "credential" })
    .toArray();
  if (credentialAccounts.length !== SEED_ACCOUNTS.length) {
    throw new Error(
      `Final verification found ${credentialAccounts.length} of ${SEED_ACCOUNTS.length} credential records`,
    );
  }
  for (const account of credentialAccounts) {
    if (
      typeof account.password !== "string" ||
      account.password.length === 0 ||
      account.password === SEED_PASSWORD
    ) {
      throw new Error(
        "Better Auth credential password was not securely hashed",
      );
    }
  }

  for (const account of SEED_ACCOUNTS) {
    const signIn = await services.auth.api.signInEmail({
      body: { email: account.email, password: SEED_PASSWORD },
    });
    trackSessionToken(signIn);
  }

  const slugs = SEED_RESTAURANTS.map((restaurant) => restaurant.slug);
  const restaurants = await services.models.Restaurant.find({
    slug: { $in: slugs },
  }).lean();
  if (restaurants.length !== SEED_RESTAURANTS.length) {
    throw new Error(
      `Final verification found ${restaurants.length} of ${SEED_RESTAURANTS.length} restaurants`,
    );
  }

  for (const prepared of preparedRestaurants) {
    const restaurant = restaurants.find(
      (candidate) => candidate.slug === prepared.seed.slug,
    );
    if (!restaurant) {
      throw new Error(`Final verification is missing ${prepared.seed.name}`);
    }
    await isCompletedRestaurant(
      prepared,
      usersByEmail.get(prepared.seed.owner.email)!,
      services,
    );

    for (const path of [
      prepared.paths.businessLicense,
      prepared.paths.ownerIdentification,
    ]) {
      const { data, error } = await (
        await import("@/lib/supabase.js")
      ).supabase.storage
        .from(services.privateBucket)
        .createSignedUrl(path, 60);
      if (error || !data.signedUrl) {
        throw new Error(
          `Unable to create verification-document preview for ${services.privateBucket}/${path}: ${error?.message ?? "missing signed URL"}`,
        );
      }
    }
  }

  if (context.sessionTokens.length > 0) {
    await services.db
      .collection("session")
      .deleteMany({ token: { $in: context.sessionTokens } });
  }
}

async function rollbackNormalSeed(services: Runtime) {
  const errors: string[] = [];
  const remove = async (label: string, operation: () => Promise<unknown>) => {
    try {
      await operation();
    } catch (error) {
      errors.push(`${label}: ${getErrorMessage(error)}`);
    }
  };

  await remove("menu items", () =>
    services.models.MenuItem.deleteMany({
      _id: { $in: context.createdMenuItemIds },
    }),
  );
  await remove("categories", () =>
    services.models.Category.deleteMany({
      _id: { $in: context.createdCategoryIds },
    }),
  );
  await remove("restaurants", () =>
    services.models.Restaurant.deleteMany({
      _id: { $in: context.createdRestaurantIds },
    }),
  );
  for (const file of [...context.uploadedFiles].reverse()) {
    await remove(`${file.bucket}/${file.path}`, () =>
      services.images.removeSeedFile(file.bucket, file.path),
    );
  }
  if (context.createdUserIds.length > 0) {
    const ids = context.createdUserIds;
    await remove("seed sessions", () =>
      services.db.collection("session").deleteMany({ userId: { $in: ids } }),
    );
    await remove("seed credential accounts", () =>
      services.db.collection("account").deleteMany({ userId: { $in: ids } }),
    );
    await remove("seed users", () =>
      services.db.collection("user").deleteMany({ _id: { $in: ids } }),
    );
  }
  return errors;
}

async function emptyFailedReset(services: Runtime) {
  const errors: string[] = [];
  for (const bucket of [services.publicBucket, services.privateBucket]) {
    try {
      await services.reset.clearBucketContents(bucket);
    } catch (error) {
      errors.push(`${bucket}: ${getErrorMessage(error)}`);
    }
  }
  try {
    await services.reset.clearMongoCollections(services.client, services.db);
  } catch (error) {
    errors.push(`MongoDB: ${getErrorMessage(error)}`);
  }
  return errors;
}

function printCredentials() {
  console.log("\nAdministrator");
  console.log(`admin@resto.com / ${SEED_PASSWORD}`);
  console.log("\nCustomer");
  console.log(`customer@resto.com / ${SEED_PASSWORD}`);
  console.log("\nRestaurant owners");
  for (const restaurant of SEED_RESTAURANTS) {
    console.log(`${restaurant.owner.email} / ${SEED_PASSWORD}`);
  }
}

async function main() {
  if (!validateExecutionPermission()) return;
  const { publicBucket, privateBucket } = requireEnvironment();

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI!);
  const [
    authModule,
    restaurantModule,
    categoryModule,
    menuItemModule,
    images,
    reset,
  ] = await Promise.all([
    import("@/lib/auth.js"),
    import("@/modules/restaurant/restaurant.model.js"),
    import("@/modules/category/category.model.js"),
    import("@/modules/menuItem/menuItem.model.js"),
    import("./seedImages.js"),
    import("./seedReset.js"),
  ]);
  await authModule.authMongoClient.connect();
  await reset.validateMongoAccess(authModule.authDb);

  runtime = {
    auth: authModule.auth,
    db: authModule.authDb,
    client: authModule.authMongoClient,
    models: {
      Restaurant: restaurantModule.Restaurant,
      Category: categoryModule.Category,
      MenuItem: menuItemModule.MenuItem,
    },
    images,
    reset,
    publicBucket,
    privateBucket,
  };

  console.log("Validating Supabase access...");
  await images.validateStorageConfiguration(publicBucket, privateBucket);
  await reset.validateBucketReadAccess(publicBucket);
  await reset.validateBucketReadAccess(privateBucket);

  console.log("Preparing and validating seed assets...");
  const preparedRestaurants = await prepareRestaurants(images);

  let mongoResetSummary: import("./seedReset.js").MongoResetSummary | undefined;
  const bucketResetSummaries: import("./seedReset.js").BucketResetSummary[] =
    [];
  if (RESET_REQUESTED) {
    console.log("Clearing restaurant media bucket...");
    bucketResetSummaries.push(await reset.clearBucketContents(publicBucket));
    console.log("Clearing verification documents bucket...");
    bucketResetSummaries.push(await reset.clearBucketContents(privateBucket));
    await reset.assertBucketEmpty(publicBucket);
    await reset.assertBucketEmpty(privateBucket);

    console.log("Clearing MongoDB collections...");
    mongoResetSummary = await reset.clearMongoCollections(
      authModule.authMongoClient,
      authModule.authDb,
    );
    await reset.assertMongoCollectionsEmpty(
      authModule.authDb,
      mongoResetSummary.collections,
    );
    resetCleanupCompleted = true;
  }

  reseedingStarted = true;
  const accountSummary = await createAndVerifyAccounts(
    authModule.auth,
    authModule.authDb,
  );
  const restaurantSummary = await createRestaurantRecords(
    preparedRestaurants,
    accountSummary.usersByEmail,
    runtime,
  );
  await createCategoriesAndMenuItems(restaurantSummary.newRestaurants, runtime);
  await uploadPreparedFiles(restaurantSummary.newRestaurants, runtime);
  await verifyFinalSeed(
    preparedRestaurants,
    accountSummary.usersByEmail,
    runtime,
  );

  console.log("\nRestoManager development seed completed successfully.");
  if (mongoResetSummary) {
    console.log(
      `MongoDB collections cleared: ${mongoResetSummary.collections.length} (${mongoResetSummary.collections.join(", ") || "none"})`,
    );
    console.log(`MongoDB records deleted: ${mongoResetSummary.recordsDeleted}`);
    for (const summary of bucketResetSummaries) {
      console.log(
        `Supabase files deleted from ${summary.bucket}: ${summary.filesDeleted}`,
      );
    }
  }
  console.log(`Users created: ${accountSummary.created}`);
  console.log(`Users reused: ${accountSummary.reused}`);
  console.log(
    `Restaurants created: ${restaurantSummary.newRestaurants.length}`,
  );
  console.log(`Restaurants reused: ${restaurantSummary.reused}`);
  console.log(`Categories created: ${context.createdCategoryIds.length}`);
  console.log(`Menu items created: ${context.createdMenuItemIds.length}`);
  console.log(
    `Logos uploaded: ${context.uploadedFiles.filter((file) => file.kind === "logo").length}`,
  );
  console.log(
    `Banners uploaded: ${context.uploadedFiles.filter((file) => file.kind === "banner").length}`,
  );
  console.log(
    `Menu-item images uploaded: ${context.uploadedFiles.filter((file) => file.kind === "menu-item").length}`,
  );
  console.log(
    `Verification documents uploaded: ${context.uploadedFiles.filter((file) => file.kind === "verification").length}`,
  );
  console.log("Failed operations: 0");
  printCredentials();
}

let exitCode = 0;
try {
  await main();
} catch (error) {
  exitCode = 1;
  console.error(`\nSeed failed: ${getErrorMessage(error)}`);

  if (runtime && RESET_REQUESTED && resetCleanupCompleted && reseedingStarted) {
    const cleanupErrors = await emptyFailedReset(runtime);
    if (cleanupErrors.length === 0) {
      console.error("Reset completed, but reseeding failed.");
      console.error(
        "All partially created seed data and uploaded files were removed.",
      );
      console.error(
        "The development database and storage buckets are currently empty.",
      );
    } else {
      console.error("Partial reseed cleanup failed:");
      for (const cleanupError of cleanupErrors) {
        console.error(`- ${cleanupError}`);
      }
    }
  } else if (runtime && reseedingStarted) {
    const rollbackErrors = await rollbackNormalSeed(runtime);
    console.error(
      rollbackErrors.length === 0
        ? "Seed failed; all records and files created by this run were removed."
        : "Seed failed and rollback was incomplete.",
    );
    for (const rollbackError of rollbackErrors) {
      console.error(`- ${rollbackError}`);
    }
  }
} finally {
  await runtime?.client.close().catch(() => undefined);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = exitCode;
}
