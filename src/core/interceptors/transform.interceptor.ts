import { TContext } from "../types/type";
import { TResponse } from "../types/response";

export const transformInterceptor = async (c: TContext, data: any) => {
  const customBody: TResponse<any> = {
    data,
    message: "Success",
    currentTimestamp: new Date().getTime(),
    statusCode: 200,
  };

  return c.json(customBody);
};
