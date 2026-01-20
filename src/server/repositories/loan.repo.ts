import type { Loan } from "@server/models/loan";
import { mysqlPool } from "../../lib/mysql";

export const LoanRepo = {
  async create(dto: Omit<Loan, "id_loan">) {
    const [result] = await mysqlPool.execute("INSERT INTO loans (member_id, admin_id, book_id, due_date) VALUES (?, ?, ?, ?)", [
      dto.member_id,
      dto.admin_id,
      dto.book_id,
      dto.due_date,
    ]);
    const insertId = (result as any).insertId;
    const [rows] = await mysqlPool.query("SELECT * FROM loans WHERE id_loan = ?", [insertId]);

    return (rows as any[])[0];
  },

  async getAll(filter?: { search?: string | null; page?: number; limit?: number }) {
    const whereParts = filter?.search ? [`title LIKE ?`] : [];
    const values = filter?.search ? [`%${filter.search}%`] : [];

    const paginationParts = filter?.page && filter?.limit ? [`LIMIT ?`, `OFFSET ?`] : [];

    const paginationValues = filter?.page && filter?.limit ? [filter.limit, (filter.page - 1) * filter.limit] : [];

    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const pagination = paginationParts.join(" ");

    const [rows] = await mysqlPool.query(`SELECT * FROM laons ${where} ORDER BY id_loan DESC ${pagination}`, [
      ...values,
      ...paginationValues,
    ]);
    console.log(rows)
    return rows as Loan[];
  },

  async getById(id: string) {
    const [rows] = await mysqlPool.query("SELECT * FROM buku WHERE id = ?", [id]);
    return (rows as Loan[])[0] ?? null;
  },

  async update(id: string, dto: Partial<Omit<Loan, "id_loan">>) {
    const [result] = await mysqlPool.execute("UPDATE buku SET judul = ?, author = ?, penerbit = ?, kategori = ? WHERE id = ?", [
      dto.member_id,
      dto.admin_id,
      dto.book_id,
      dto.due_date,
      id,
    ]);
    if ((result as any).affectedRows === 0) return null;

    const [rows] = await mysqlPool.query("SELECT * FROM buku WHERE id = ?", [id]);

    return (rows as any[])[0];
  },

  async delete(id: string) {
    const [result] = await mysqlPool.execute("DELETE FROM buku WHERE id = ?", [id]);
    return (result as any).affectedRows > 0;
  },
};
