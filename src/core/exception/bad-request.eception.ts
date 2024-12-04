import { HTTPException } from "hono/http-exception";

export class BadRequestException extends HTTPException {
  constructor(message: number, errors?: any) {
    super(400);
    this.name = "BadRequestException";
    this.message = message.toString();
    this.cause = errors;
  }
}
