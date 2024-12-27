import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type TUserUpdateSchema = z.infer<typeof userUpdateSchema>;
