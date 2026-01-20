import type { Book } from "@models/book";
import { mysqlPool } from "../../lib/mysql";

export const BooksRepo = {
  async create(dto: Omit<Book, "id">) {
    const [result] = await mysqlPool.execute("INSERT INTO buku (judul, author, penerbit, kategori) VALUES (?, ?, ?, ?)", [
      dto.title,
      dto.author,
      dto.publisher,
      dto.category,
    ]);
    const insertId = (result as any).insertId;
    const [rows] = await mysqlPool.query("SELECT * FROM buku WHERE id = ?", [insertId]);

    return (rows as any[])[0];
  },

  async getAll(filter?: { search?: string | null; page?: number; limit?: number }) {
    const whereParts = filter?.search ? [`title LIKE ?`] : [];
    const values = filter?.search ? [`%${filter.search}%`] : [];

    const paginationParts = filter?.page && filter?.limit ? [`LIMIT ?`, `OFFSET ?`] : [];

    const paginationValues = filter?.page && filter?.limit ? [filter.limit, (filter.page - 1) * filter.limit] : [];

    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const pagination = paginationParts.join(" ");

    const [rows] = await mysqlPool.query(`SELECT * FROM books ${where} ORDER BY id_book DESC ${pagination}`, [
      ...values,
      ...paginationValues,
    ]);
    console.log(rows)
    return rows as Book[];
  },

  async getById(id: string) {
    const [rows] = await mysqlPool.query("SELECT * FROM buku WHERE id = ?", [id]);
    return (rows as Book[])[0] ?? null;
  },

  async update(id: string, dto: Partial<Omit<Book, "id">>) {
    const [result] = await mysqlPool.execute("UPDATE buku SET judul = ?, author = ?, penerbit = ?, kategori = ? WHERE id = ?", [
      dto.title,
      dto.author,
      dto.publisher,
      dto.category,
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
