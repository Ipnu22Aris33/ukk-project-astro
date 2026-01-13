import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { z } from "zod";
import { MembersService } from "@server/services/member.service";

const bookSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(1),
  class: z.string().min(1),
  major: z.string().min(1),
  role: z.string().min(1), 
});

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const bookData = await validateBody(request, bookSchema);
    return MembersService.create(bookData);
  });

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const url = new URL(request.url);
    return MembersService.getAll({
      search: url.searchParams.get("search"),
      category: url.searchParams.get("category"),
    });
  });
