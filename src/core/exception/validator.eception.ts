import { HTTPException } from "hono/http-exception";
import { ERROR_MESSAGES } from "../../common/error.common";

export class ValidatorException extends HTTPException {
  constructor(errors: any) {
    super(400);
    this.name = "ValidatorException";
    this.message = ERROR_MESSAGES.ValidationError.toString();
    this.cause = errors;
  }
}
