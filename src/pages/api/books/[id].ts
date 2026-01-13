import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { BooksService } from "@server/services/book.service";
import { z } from "zod";
import { validateBody } from "@utils/validate";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
});

export const GET: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    return BooksService.getById(id);
  });

export const PATCH: APIRoute = async ({ params, request }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    const bookData = await validateBody(request, bookSchema);

    return BooksService.update(id, bookData);
  });

export const DELETE: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    return BooksService.delete(id);
  });
