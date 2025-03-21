import { Next } from "hono";
import type { TContext } from "../types/type";

let currentEnv: CloudflareBindings | null = null;

export const setContext = (c: TContext, next: Next) => {
  currentEnv = c.env;
  return next();
};

export const getEnv = <T extends keyof CloudflareBindings>(
  key: T
): CloudflareBindings[T] => {
  if (!currentEnv) {
    throw new Error(
      "Environment not initialized. Make sure to use setContext first."
    );
  }
  return currentEnv[key];
};
