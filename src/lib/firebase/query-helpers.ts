/**
 * Reusable Firestore query helpers (Sprint 2.2 — Firebase Services).
 *
 * Composes ordering, filtering, and pagination into a single `buildQuery`
 * call, so services don't hand-assemble Firestore `query()` constraints
 * themselves — one generic implementation, reused by every domain
 * service via `createFirestoreService`'s `getAll(options)` parameter.
 */
import {
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type CollectionReference,
  type DocumentData,
  type OrderByDirection,
  type Query,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type WhereFilterOp,
  Timestamp,
} from "firebase/firestore";

export interface OrderOption {
  field: string;
  direction?: OrderByDirection;
}

export interface FilterOption {
  field: string;
  op: WhereFilterOp;
  value: unknown;
}

export interface QueryOptions<T extends DocumentData = DocumentData> {
  orderByField?: OrderOption;
  filters?: FilterOption[];
  pageSize?: number;
  /** Pass the last document from a previous page to fetch the next one. */
  startAfterDoc?: QueryDocumentSnapshot<T>;
}

/**
 * Builds a typed Firestore `Query` by composing filter, order, and
 * pagination constraints from a single options object.
 */
export function buildQuery<T extends DocumentData>(
  collectionRef: CollectionReference<T>,
  options: QueryOptions<T> = {}
): Query<T> {
  const constraints: QueryConstraint[] = [];

  for (const filter of options.filters ?? []) {
    constraints.push(where(filter.field, filter.op, filter.value));
  }

  if (options.orderByField) {
    constraints.push(
      orderBy(options.orderByField.field, options.orderByField.direction ?? "asc")
    );
  }

  if (options.startAfterDoc) {
    constraints.push(startAfter(options.startAfterDoc));
  }

  if (options.pageSize) {
    constraints.push(limit(options.pageSize));
  }

  return query(collectionRef, ...constraints);
}

/**
 * Converts a Firestore Timestamp to a native JS Date, safely handling
 * `undefined`/`null` (e.g. a field that hasn't been set yet).
 */
export function timestampToDate(
  timestamp: Timestamp | undefined | null
): Date | null {
  return timestamp ? timestamp.toDate() : null;
}

/** Converts a native JS Date to a Firestore Timestamp for writes. */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}
