import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { BooksService } from "@server/services/book.service";
import { z } from "zod";
import { validateBody } from "@utils/validate";
import { successResponse } from "@utils/response";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
});

export const GET: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    const data = await BooksService.getById(id);
    return successResponse(data, "success mengambil data");
  });

export const PATCH: APIRoute = async ({ params, request }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    const bookData = await validateBody(request, bookSchema);

    const data = await BooksService.update(id, bookData);
    return successResponse(data, "data berhasil update");
  });

export const DELETE: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);
    return BooksService.delete(id);
  });
