import type { APIRoute } from "astro";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { mysqlPool } from "@lib/mysql";
import { type ReturnModel } from "@models/return";
import { ok } from "@utils/apiResponse";
import { NotFound, UnprocessableEntity } from "@utils/httpError";

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const { loan_id } = await request.json();

    const conn = await mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Ambil data loan + book
      const [rows] = await conn.query(
        `
        SELECT 
          l.id_loan,
          l.book_id,
          l.count,
          l.due_date,
          l.return_date,
          b.stock
        FROM loans l
        JOIN books b ON b.id_book = l.book_id
        WHERE l.id_loan = ?
        FOR UPDATE
        `,
        [loan_id],
      );

      if ((rows as any[]).length === 0) {
        throw new NotFound("Data peminjaman tidak ditemukan");
      }

      const loan = (rows as any[])[0];

      if (loan.return_date) {
        throw new UnprocessableEntity("Buku sudah dikembalikan");
      }

      // 2. Hitung denda per hari
      const now = new Date();
      const dueDate = new Date(loan.due_date);

      let penaltyFee = 0;
      let returnStatus = "unpaid";
      let loanStatus = "returned";

      if (now > dueDate) {
        const diffTime = now.getTime() - dueDate.getTime();
        const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        penaltyFee = lateDays * 1000;
      }

      // 3. Insert ke tabel returns
      await conn.execute(
        `
        INSERT INTO returns 
          (loan_id, return_date, penalty_fee, status)
        VALUES (?, ?, ?, ?)
        `,
        [loan.id_loan, now, penaltyFee, returnStatus],
      );

      // 4. Update loans
      await conn.execute(
        `
        UPDATE loans
        SET return_date = ?, status = ?
        WHERE id_loan = ?
        `,
        [now, loanStatus, loan.id_loan],
      );

      // 5. Kembalikan stok buku
      await conn.execute(
        `
        UPDATE books
        SET stock = stock + ?
        WHERE id_book = ?
        `,
        [loan.count, loan.book_id],
      );

      await conn.commit();

      // 6. Ambil data return
      const [returnRows] = await conn.query(`SELECT * FROM returns WHERE loan_id = ?`, [loan.id_loan]);

      return ok((returnRows as ReturnModel[])[0]);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  });
