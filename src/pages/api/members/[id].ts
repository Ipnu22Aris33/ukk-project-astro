import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { MembersService } from "@server/services/member.service";
import { z } from "zod";
import { validateBody } from "@utils/validate";

const bookSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  class: z.string().min(1),
  major: z.string().min(1),
  role: z.string().min(1),
});

export const GET: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    return MembersService.getById(id);
  });

export const PATCH: APIRoute = async ({ params, request }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    const bookData = await validateBody(request, bookSchema);

    return MembersService.update(id, bookData);
  });

export const DELETE: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    return MembersService.delete(id);
  });
