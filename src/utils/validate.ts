import type { ZodType } from "zod";

export const validateBody = async <T>(
  request: Request,
  schema: ZodType<T>
): Promise<T> => {
  const body = (await request.json()) as unknown;
  return schema.parse(body);
};
