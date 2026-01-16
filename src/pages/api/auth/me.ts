import type { APIRoute } from "astro";
import { AuthService } from "@server/services/auth.service";

export const GET: APIRoute = async ({ locals }) => {
  console.log("locals.user", locals.user);

  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await AuthService.getMyProfile(locals.user.sub);
  return new Response(JSON.stringify(profile), { headers: { "Content-Type": "application/json" } });
};
