import { HTTPException } from "hono/http-exception";

export class ForbiddenException extends HTTPException {
  constructor(errors?: any) {
    super(403);
    this.name = "ForbiddenException";
    this.message = "Authorization failed";
    this.cause = errors;
  }
}