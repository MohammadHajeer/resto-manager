import type { HydratedDocument, Types } from "mongoose";

type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Types.ObjectId;

type DotPath<T> = T extends Primitive
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends Primitive
        ? K
        : T[K] extends Array<unknown>
          ? K
          : K | `${K}.${DotPath<T[K]>}`;
    }[Extract<keyof T, string>];

type DotPathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? DotPathValue<NonNullable<T[K]>, Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export function setIfDefined<TDocument, TPath extends DotPath<TDocument>>(
  document: HydratedDocument<TDocument>,
  path: TPath,
  value: DotPathValue<TDocument, TPath> | undefined,
) {
  if (value !== undefined) {
    document.set(path, value);
  }
}
