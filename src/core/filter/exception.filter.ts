import { HTTPResponseError } from "hono/types";
import { TContext } from "../types/type";
import { ErrorCustom } from "../base/error.base";
import { ERROR_MESSAGES } from "../../common/error.common";
import { StatusCode } from "hono/utils/http-status";
import { TResponse } from "../types/response";
import { HTTPException } from "hono/http-exception";

const errorCustom = new ErrorCustom(ERROR_MESSAGES);

export const exceptionFilter = (error: Error | HTTPException, c: TContext) => {
  console.log(error);

  const { errorCode, message } = errorCustom.messageCode(error);

  const res: TResponse<any> = {
    statusCode: (error as HTTPException).status || c.res.status,
    message,
    errorCode,
    currentTimestamp: new Date().getTime(),
  };

  return c.json(res, c.res.status as StatusCode);
};
