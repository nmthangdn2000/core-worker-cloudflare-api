import { Next } from "hono";
import { TContext } from "../types/type";

export const parsePayload = async (c: TContext, next: Next) => {
  const contentType = c.req.header("content-type") || "";

  try {
    let body = {};

    if (contentType.includes("application/json")) {
      body = await c.req.json(); // Parse JSON
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await c.req.parseBody(); // Parse Form Data
    }

    c.set("parsedBody", body);
  } catch (err) {
    return c.text("Invalid payload", 400);
  }

  await next();
};
