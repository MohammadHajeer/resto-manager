import type { Db, MongoClient } from "mongodb";
import { supabase } from "@/lib/supabase.js";
import { getErrorMessage } from "./seedUtils.js";

const STORAGE_PAGE_SIZE = 100;
const STORAGE_DELETE_BATCH_SIZE = 100;
const MAX_BUCKET_CLEANUP_PASSES = 10;

const MONGO_DEPENDENCY_ORDER = [
  "orders",
  "menuitems",
  "categories",
  "addresses",
  "restaurants",
  "session",
  "account",
  "verification",
  "ratelimit",
  "user",
] as const;

export type MongoResetSummary = {
  collections: string[];
  recordsDeleted: number;
  recordsDeletedByCollection: Record<string, number>;
};

export type BucketResetSummary = {
  bucket: string;
  filesDeleted: number;
};

function isTransactionUnavailable(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("transaction numbers are only allowed") ||
    message.includes("replica set member or mongos") ||
    message.includes("does not support retryable writes") ||
    message.includes("transactions are not supported")
  );
}

function orderCollections(collections: string[]) {
  const priority = new Map<string, number>(
    MONGO_DEPENDENCY_ORDER.map((name, index) => [name, index]),
  );

  return [...collections].sort((left, right) => {
    const leftPriority = priority.get(left.toLowerCase()) ?? 5;
    const rightPriority = priority.get(right.toLowerCase()) ?? 5;
    return leftPriority - rightPriority || left.localeCompare(right);
  });
}

export async function getProjectCollectionNames(db: Db) {
  const definitions = await db.listCollections({}, { nameOnly: true }).toArray();
  return orderCollections(
    definitions
      .map((definition) => definition.name)
      .filter((name) => !name.startsWith("system.")),
  );
}

export async function validateMongoAccess(db: Db) {
  await db.command({ ping: 1 });
  await getProjectCollectionNames(db);
}

export async function assertMongoCollectionsEmpty(
  db: Db,
  collectionNames: string[],
) {
  const nonEmpty: string[] = [];
  for (const name of collectionNames) {
    const count = await db.collection(name).countDocuments({}, { limit: 1 });
    if (count > 0) nonEmpty.push(name);
  }
  if (nonEmpty.length > 0) {
    throw new Error(
      `MongoDB cleanup verification failed; non-empty collections: ${nonEmpty.join(", ")}`,
    );
  }
}

export async function clearMongoCollections(
  client: MongoClient,
  db: Db,
): Promise<MongoResetSummary> {
  const collections = await getProjectCollectionNames(db);
  const recordsDeletedByCollection: Record<string, number> = {};

  for (const name of collections) {
    recordsDeletedByCollection[name] = await db.collection(name).countDocuments();
  }

  const deleteCollections = async (session?: ReturnType<MongoClient["startSession"]>) => {
    for (const name of collections) {
      await db.collection(name).deleteMany({}, session ? { session } : undefined);
    }
  };

  const session = client.startSession();
  try {
    try {
      await session.withTransaction(() => deleteCollections(session));
    } catch (error) {
      if (!isTransactionUnavailable(error)) throw error;
      console.warn(
        "  MongoDB transactions are unavailable; clearing collections sequentially.",
      );
      await deleteCollections();
    }
  } finally {
    await session.endSession();
  }

  await assertMongoCollectionsEmpty(db, collections);

  return {
    collections,
    recordsDeleted: Object.values(recordsDeletedByCollection).reduce(
      (total, count) => total + count,
      0,
    ),
    recordsDeletedByCollection,
  };
}

async function listBucketFilesRecursive(
  bucket: string,
  folder = "",
): Promise<string[]> {
  const paths: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: STORAGE_PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      throw new Error(
        `Unable to list ${bucket}/${folder || "<root>"}: ${error.message}`,
      );
    }

    for (const entry of data) {
      const entryPath = folder ? `${folder}/${entry.name}` : entry.name;
      if (entry.id === null) {
        paths.push(...(await listBucketFilesRecursive(bucket, entryPath)));
      } else {
        paths.push(entryPath);
      }
    }

    if (data.length < STORAGE_PAGE_SIZE) break;
    offset += data.length;
  }

  return paths;
}

export async function validateBucketReadAccess(bucket: string) {
  await listBucketFilesRecursive(bucket);
}

export async function assertBucketEmpty(bucket: string) {
  const remaining = await listBucketFilesRecursive(bucket);
  if (remaining.length > 0) {
    throw new Error(
      `Supabase cleanup verification failed for '${bucket}'; ${remaining.length} file(s) remain`,
    );
  }
}

export async function clearBucketContents(
  bucket: string,
): Promise<BucketResetSummary> {
  let filesDeleted = 0;

  for (let pass = 1; pass <= MAX_BUCKET_CLEANUP_PASSES; pass += 1) {
    const paths = await listBucketFilesRecursive(bucket);
    if (paths.length === 0) return { bucket, filesDeleted };

    for (
      let start = 0;
      start < paths.length;
      start += STORAGE_DELETE_BATCH_SIZE
    ) {
      const batch = paths.slice(start, start + STORAGE_DELETE_BATCH_SIZE);
      const { error } = await supabase.storage.from(bucket).remove(batch);
      if (error) {
        throw new Error(
          `Failed to delete ${batch.length} file(s) from '${bucket}' (${batch.join(", ")}): ${error.message}`,
        );
      }
      filesDeleted += batch.length;
    }
  }

  const remaining = await listBucketFilesRecursive(bucket);
  throw new Error(
    `Unable to empty Supabase bucket '${bucket}' after ${MAX_BUCKET_CLEANUP_PASSES} passes; ${remaining.length} file(s) remain`,
  );
}
