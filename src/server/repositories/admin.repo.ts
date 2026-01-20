import type { Admin } from "@models/admin";
import { mysqlPool } from "../../lib/mysql";

export const AdminRepo = {
  // =========================
  // CREATE MEMBER
  // =========================
  async create(dto: Omit<Admin, "id_admin" | "sign_in_at" | "sign_out_at" | "sign_up_at">) {
    const [result] = await mysqlPool.execute(`INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`, [
      dto.username,
      dto.email,
      dto.password,
    ]);

    const insertId = (result as any).insertId;
    return this.getById(insertId);
  },

  // =========================
  // GET ALL MEMBERS
  // =========================
  async getAll(filter?: { search?: string | null; page?: number; limit?: number }) {
    const whereParts = filter?.search ? [`name LIKE ?`] : [];
    const values = filter?.search ? [`%${filter.search}%`] : [];

    const paginationParts = filter?.page && filter?.limit ? [`LIMIT ?`, `OFFSET ?`] : [];

    const paginationValues = filter?.page && filter?.limit ? [filter.limit, (filter.page - 1) * filter.limit] : [];

    const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const pagination = paginationParts.join(" ");

    const [rows] = await mysqlPool.query(`SELECT * FROM admins ${where} ORDER BY id_admin DESC ${pagination}`, [
      ...values,
      ...paginationValues,
    ]);

    return rows as Admin[];
  },

  // =========================
  // GET MEMBER BY ID
  // =========================
  async getById(id: string | number) {
    const [rows] = await mysqlPool.query(`SELECT * FROM admins WHERE id_admin = ?`, [id]);

    return (rows as Admin[])[0] ?? null;
  },

  async getByEmail(email: string) {
    const [rows] = await mysqlPool.query(`SELECT * FROM admins WHERE email = ?`, [email]);
    return (rows as Admin[])[0] ?? null;
  },

  // =========================
  // UPDATE MEMBER
  // =========================
  async update(id: string | number, dto: Partial<Omit<Admin, "id_admin">>) {
    const fieldMapping = {
      username: "username",
      email: "email",
      password: "password",
      sign_up_at: "sign_up_at",
      sign_in_at: "sign_in_at",
      sign_out_at: "sign_out_at",
    };

    // Filter field yang ada di DTO
    const updates = Object.entries(dto)
      .filter(([key]) => key in fieldMapping && dto[key as keyof typeof dto] !== undefined)
      .map(([key, value]) => ({
        field: fieldMapping[key as keyof typeof fieldMapping],
        value,
      }));

    if (!updates.length) return null;

    const fields = updates.map((update) => `${update.field} = ?`).join(", ");
    const values = [...updates.map((update) => update.value), id];

    const [result] = await mysqlPool.execute(`UPDATE admins SET ${fields} WHERE id_admin = ?`, values);

    if ((result as any).affectedRows === 0) return null;
    return this.getById(id);
  },

  // =========================
  // DELETE MEMBER
  // =========================
  async delete(id: string | number) {
    const [result] = await mysqlPool.execute(`DELETE FROM admins WHERE id_admin = ?`, [id]);

    return (result as any).affectedRows > 0;
  },
};
