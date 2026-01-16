import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { z } from "zod";
import { MemberService } from "@server/services/member.service";

const bookSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  class: z.string().min(1),
  major: z.string().min(1),
});

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const url = new URL(request.url);
    return MemberService.getAll({
      search: url.searchParams.get("search"),
    });
  });
