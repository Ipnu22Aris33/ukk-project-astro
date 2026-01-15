import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { UserService } from "@server/services/user.service";
import z from "zod";

const Schema = z.object({
  email: z.email().min(1),
  password: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  return tryCatchApi(async () => {
    const body = await validateBody(request, Schema);

    const data = await UserService.signIn(body);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${data.data?.token}; HttpOnly; Path=/; SameSite=Strict`,
        "Content-Type": "application/json",
      },
    });
  });
};
