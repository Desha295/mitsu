/**
 * Auth Foundation — public entry point (Sprint 2.3 — Security Foundation).
 * Re-exports roles, permissions, session helpers, admin authorization,
 * and route guard utilities, so future code can
 * `import { useAuthGuard, hasPermission } from "@/lib/auth"`.
 */
export * from "./types";
export * from "./constants";
export * from "./roles";
export * from "./permissions";
export * from "./validation";
export * from "./session";
export * from "./adminAuth";
export * from "./routeGuard";
