import { defineMiddleware } from "astro:middleware";
import { AuthService } from "@server/services/auth.service";

export const onRequest = defineMiddleware(async ({ cookies, url, locals }, next) => {
  const publicPaths = ["/auth", "/api/auth/sign-in", "/api/auth/sign-up"];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return next();
  }

  const token = cookies.get("token")?.value;
  if (!token) {
    return Response.redirect(new URL("/auth", url), 302);
  }

  try {
    const decoded = AuthService.verifyToken(token);
    locals.user = decoded;
  } catch {
    return Response.redirect(new URL("/auth", url), 302);
  }

  if (url.pathname.startsWith("/admin") && locals.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  return next();
});
