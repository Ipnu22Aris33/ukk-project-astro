import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { ok } from "@utils/apiResponse";
import { type Book } from "@models/book";
import { mysqlPool } from "@lib/mysql";
import { BookSchema } from "@models/book";

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, BookSchema);
    const [result] = await mysqlPool.execute(`INSERT INTO books (title, author, publisher, category, stock) VALUES (?, ?, ?, ?, ?)`, [
      body.title,
      body.author,
      body.publisher,
      body.category,
      body.stock,
    ]);

    const insertId = (result as any).insertId;
    const [rows] = await mysqlPool.query(`SELECT * FROM books WHERE id_book = ?`, [insertId]);

    return ok((rows as Book[])[0]);
  });

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
     const url = new URL(request.url);
     const search = url.searchParams.get("search");
 
     // Parameter paginasi
     const page = parseInt(url.searchParams.get("page") || "1");
     const limit = parseInt(url.searchParams.get("limit") || "10");
     const offset = (page - 1) * limit;
 
     // Query untuk data dengan paginasi
     const where = search ? `WHERE title LIKE ?` : "";
     const values = search ? [`%${search}%`] : [];
 
     // Query untuk mendapatkan total data
     const [totalRows] = await mysqlPool.query(`SELECT COUNT(*) as total FROM books ${where}`, values);
     const total = (totalRows as any)[0]?.total || 0;
 
     // Query untuk data dengan paginasi
     const paginationValues = [...values, limit, offset];
     const [rows] = await mysqlPool.query(
       `SELECT * FROM books ${where} ORDER BY id_book DESC LIMIT ? OFFSET ?`,
       paginationValues,
     );
     const result = rows as Book[];
 
     // const {password, ...safe } = result;
 
     return ok(result, {
       meta: {
         page,
         limit,
         total,
         totalPages: Math.ceil(total / limit),
         hasNext: page < Math.ceil(total / limit),
         hasPrev: page > 1,
       },
     });
   });