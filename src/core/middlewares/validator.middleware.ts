import { Next } from "hono";
import { TContext } from "../types/type";
import { z } from "zod";
import { ValidatorException } from "../exception/validator.eception";
import qs from "qs";

type Targets = "body" | "query" | "params";

export const validatorMiddleware =
  (schema: z.Schema, targets: Targets = "body") =>
  (c: TContext, next: Next) => {
    const { success, data, error } = schema.safeParse(
      targets === "body"
        ? c.get("parsedBody")
        : targets === "query"
        ? qs.parse(c.req.query())
        : c.req.param()
    );

    if (!success) {
      throw new ValidatorException(error.formErrors.fieldErrors);
    }

    switch (targets) {
      case "body":
        c.set("parsedBody", data);
        break;
      case "query":
        c.set("parsedQuery", data);
        break;
      case "params":
        c.set("parsedParams", data);
        break;
    }

    return next();
  };
