import type { APIRoute } from "astro";
import { ok } from "@utils/apiResponse";
import { AuthService } from "@server/services/auth.service";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.member) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await AuthService.getMyProfile(locals.member.memberId);

  return new Response(
    JSON.stringify(ok(profile)),
    { headers: { "Content-Type": "application/json" } }
  );
};
