import { defineMiddleware } from "astro:middleware";
import { UserService } from "@server/services/user.service";

export const onRequest = defineMiddleware(async ({ cookies, url, locals }, next) => {
  const publicPaths = ["/auth", "/api/auth/sign-in"];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) {
    return next();
  }

  const token = cookies.get("token")?.value; // <-- gunakan cookies.get()
  if (!token) {
    return Response.redirect(new URL("/auth", url), 302);
  }

  try {
    const decoded = UserService.verifyToken(token);
    locals.user = decoded; // sekarang locals.user pasti ada
  } catch {
    return Response.redirect(new URL("/auth", url), 302);
  }

  if (url.pathname.startsWith("/admin") && locals.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  return next();
});
