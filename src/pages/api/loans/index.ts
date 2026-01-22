import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { mysqlPool } from "@lib/mysql";
import { type Loan, LoanSchema } from "@models/loan";
import { ok } from "@utils/apiResponse";

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, LoanSchema);

    const [member, admin, book] = await Promise.all([
      mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [body.member_id]),
      mysqlPool.query(`SELECT * FROM admins WHERE id_admin = ?`, [body.admin_id]),
      mysqlPool.query(`SELECT * FROM books WHERE id_book = ?`, [body.book_id]),
    ]);

    // 1. Validasi relasi
    if ((member[0] as any[]).length === 0) {
      throw new Error("Member not found");
    }

    if ((admin[0] as any[]).length === 0) {
      throw new Error("Admin not found");
    }

    if ((book[0] as any[]).length === 0) {
      throw new Error("Book not found");
    }

    const bookData = (book[0] as any[])[0];

    // 2. Validasi stok
    if (bookData.stock < body.count) {
      throw new Error("Stok buku tidak mencukupi");
    }

    // 3. Insert loan (baru jalan kalau semua valid)
    const [result] = await mysqlPool.execute(
      `INSERT INTO loans (member_id, admin_id, book_id, count, loan_date, due_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [body.member_id, body.admin_id, body.book_id, body.count, body.loan_date, body.due_date, body.return_date, body.status],
    );

    await mysqlPool.execute(`UPDATE books SET stock = stock - ? WHERE id_book = ?`, [body.count, body.book_id]);

    const insertId = (result as any).insertId;

    const [rows] = await mysqlPool.query(`SELECT * FROM loans WHERE id_loan = ?`, [insertId]);

    return ok((rows as Loan[])[0]);
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
    const [totalRows] = await mysqlPool.query(`SELECT COUNT(*) as total FROM loans ${where}`, values);
    const total = (totalRows as any)[0]?.total || 0;

    // Query untuk data dengan paginasi
    const paginationValues = [...values, limit, offset];
    const [rows] = await mysqlPool.query(`SELECT * FROM loans ${where} ORDER BY id_loan DESC LIMIT ? OFFSET ?`, paginationValues);
    const result = rows as Loan[];

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
