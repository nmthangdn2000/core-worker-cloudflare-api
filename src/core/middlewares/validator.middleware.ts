import { Next } from "hono";
import { TContext, TKeyVariable } from "../types/type";
import { z } from "zod";
import { ValidatorException } from "../exception/validator.eception";

type Targets = "body" | "query" | "params";

export const validatorMiddleware =
  (schema: z.Schema, targets: Targets = "body") =>
  (c: TContext, next: Next) => {
    const { success, error } = schema.safeParse(
      targets === "body"
        ? c.get("parsedBody")
        : targets === "query"
        ? c.req.query()
        : c.req.param()
    );
    if (!success) {
      throw new ValidatorException(error.formErrors.fieldErrors);
    }

    return next();
  };
