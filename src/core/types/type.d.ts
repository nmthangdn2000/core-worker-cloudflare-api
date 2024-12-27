import { User } from "@prisma/client";
import { Context } from "hono";
import { BlankEnv } from "hono/types";

export type TBlankEnv = BlankEnv & {
  Bindings: CloudflareBindings;
  Variables: TKeyVariable;
};

export type TContext = Context<TBlankEnv>;

export type TKeyVariable = {
  parsedBody: any;
  parsedQuery: any;
  parsedParams: any;
  response: any;
  userAuth: User;
};
