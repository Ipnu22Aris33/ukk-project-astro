import type { APIRoute } from "astro";
import { ok } from "@utils/apiResponse";
import { UserService } from "@server/services/user.service";

export const GET: APIRoute = async ({ locals }) => {
  console.log("locals.user", locals.user);

  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await UserService.getMyProfile(locals.user.userId);
  return new Response(JSON.stringify(profile), { headers: { "Content-Type": "application/json" } });
};
