import type { APIRoute } from "astro";
import { ok } from "@utils/apiResponse";
import { UserService } from "@server/services/user.service";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await UserService.getMyProfile(locals.user.userId);

  return new Response(JSON.stringify(ok(profile)), { headers: { "Content-Type": "application/json" } });
};
