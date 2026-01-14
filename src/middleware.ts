import { defineMiddleware } from "astro:middleware";
import { AuthService } from "@server/services/auth.service";

export const onRequest = defineMiddleware(async ({ request, url, locals }, next) => {
  const publicPaths = ["/auth", "/api/auth"];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return next();
  }

  const cookie = request.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return Response.redirect(new URL("/auth/sign-in", url), 302);
  }

  try {
    const decoded = AuthService.verifyToken(token);

    locals.member = decoded;
  } catch {
    return Response.redirect(new URL("/auth/sign-in", url), 302);
  }

  if (url.pathname.startsWith("/admin") && locals.member.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  return next();
});
