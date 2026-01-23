import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { mysqlPool } from "@lib/mysql";
import { type Loan, LoanSchema } from "@models/loan";
import { ok } from "@utils/apiResponse";
import { NotFound, UnprocessableEntity } from "@utils/httpError";

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, LoanSchema);

    const conn = await mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      /* =========================
         VALIDASI MEMBER, ADMIN, BOOK
      ========================== */
      const [rows] = await conn.query(
        `
        SELECT
          m.id_member,
          a.id_admin,
          b.id_book,
          b.stock
        FROM members m
        JOIN admins a ON a.id_admin = ?
        JOIN books b ON b.id_book = ?
        WHERE m.id_member = ?
        `,
        [body.admin_id, body.book_id, body.member_id],
      );

      if ((rows as any[]).length === 0) {
        throw new NotFound("Member / Admin / Book tidak ditemukan");
      }

      const data = (rows as any[])[0];

      if (data.stock < body.count) {
        throw new UnprocessableEntity("Stok buku tidak mencukupi");
      }

      /* =========================
         INSERT LOAN
      ========================== */
      const [insertResult] = await conn.execute(
        `
        INSERT INTO loans 
          (member_id, admin_id, book_id, count, loan_date, due_date, return_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [body.member_id, body.admin_id, body.book_id, body.count, body.loan_date, body.due_date, body.return_date, body.status],
      );

      const insertId = (insertResult as any).insertId;

      /* =========================
         UPDATE STOCK
      ========================== */
      await conn.execute(`UPDATE books SET stock = stock - ? WHERE id_book = ?`, [body.count, body.book_id]);

      /* =========================
         COMMIT
      ========================== */
      await conn.commit();

      const [loanRows] = await conn.query(`SELECT * FROM loans WHERE id_loan = ?`, [insertId]);

      return ok((loanRows as Loan[])[0]);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
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
