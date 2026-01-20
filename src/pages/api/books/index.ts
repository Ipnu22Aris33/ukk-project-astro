import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { z } from "zod";
import { BooksService } from "@server/services/book.service";
import { ok } from "@utils/apiResponse";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
});

// export const POST: APIRoute = async ({ request }) =>
//   tryCatchApi(async () => {
//     const bookData = await validateBody(request, bookSchema);
//     return BooksService.create(bookData);
//   });

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const url = new URL(request.url);
    return BooksService.getAll({});
  });
