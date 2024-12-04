import { TContext } from "../base/type";
import { TResponse } from "../base/response.base";

export const transformInterceptor = async (c: TContext, data: any) => {
  const customBody: TResponse<any> = {
    data,
    message: "Success",
    currentTimestamp: new Date().getTime(),
    statusCode: 200,
  };

  return c.json(customBody);
};
