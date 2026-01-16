import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import z from "zod";
import { ok } from "@utils/apiResponse";
import { AuthService } from "@server/services/auth.service";

const Schema = z.object({
  name: z.string(),
  email: z.email().min(1),
  password: z.string(),
  address: z.string(),
  class: z.string(),
  major: z.string(),
  phone: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  return tryCatchApi(async () => {
    const body = await validateBody(request, Schema);

    const data = await AuthService.signUp(body);

   return ok(data)
  });
};
