import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { BooksService } from "@server/services/book.service";
import { z } from "zod";
import { validateBody } from "@utils/validate";
import { mysqlPool } from "@lib/mysql";
import { InternalServerError, NotFound } from "@utils/httpError";
import { ok } from "@utils/apiResponse";
import type { Book } from "@models/book";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
});

export const GET: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    const [result] = await mysqlPool.query(`SELECT * FROM books WHERE id_book = ?`, [id]);
    if (!result) throw new NotFound();

    return ok(result);
  });

export const PATCH: APIRoute = async ({ params, request }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    const body = await validateBody(request, bookSchema.partial());

    const fields = Object.keys(body)
      .map((key) => `${key} = ?`)
      .join(", ");

    if (!fields) throw new InternalServerError("Tidak ada data diupdate");

    const values = [...Object.values(body), id];

    const [result] = await mysqlPool.execute(`UPDATE books SET ${fields} WHERE id_book = ?`, values);

    if ((result as any).affectedRows === 0) throw new NotFound();

    const [rows] = await mysqlPool.query(`SELECT * FROM books WHERE id_book = ?`, [id]);

    return ok((rows as Book[])[0]);
  });

export const DELETE: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    if (!id) throw new NotFound("ID tidak ditemukan");

    const [result] = await mysqlPool.execute(`DELETE FROM books WHERE id_book = ?`, [id]);

    if ((result as any).affectedRows === 0) throw new NotFound();

    return ok(true);
  });
