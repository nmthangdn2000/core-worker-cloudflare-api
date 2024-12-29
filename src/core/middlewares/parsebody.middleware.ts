import { Next } from "hono";
import { TContext } from "../types/type";

export const parsePayload = async (c: TContext, next: Next) => {
  const contentType = c.req.header("content-type") || "";

  let body = {};
  try {
    if (contentType.includes("application/json")) {
      body = await c.req.json(); // Parse JSON
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await c.req.parseBody(); // Parse Form Data
    }
  } catch (err) {
    return c.text("Invalid payload", 400);
  }

  c.set("parsedBody", body);

  await next();
};
