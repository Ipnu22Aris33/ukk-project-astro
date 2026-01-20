import type { Member } from "@models/member";
import { mysqlPool } from "../../lib/mysql";

export const MemberRepo = {
  // =========================
  // CREATE MEMBER
  // =========================
  async create(dto: Omit<Member, "id_member">) {
    const [result] = await mysqlPool.execute(
      `INSERT INTO members (name, email, password, phone, address, class, major) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dto.name, dto.email, dto.password, dto.phone, dto.address, dto.class, dto.major]
    );

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

    const [rows] = await mysqlPool.query(`SELECT * FROM members ${where} ORDER BY id_member DESC ${pagination}`, [
      ...values,
      ...paginationValues,
    ]);

    return rows as Member[];
  },

  // =========================
  // GET MEMBER BY ID
  // =========================
  async getById(id: string | number) {
    const [rows] = await mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [id]);

    return (rows as Member[])[0] ?? null;
  },

  async getByEmail(email: string) {
    const [rows] = await mysqlPool.query(`SELECT * FROM members WHERE email = ?`, [email]);
    return (rows as Member[])[0] ?? null;
  },

  // =========================
  // UPDATE MEMBER
  // =========================
  async update(id: string | number, dto: Partial<Omit<Member, "id_member">>) {
    // Mapping field DTO ke kolom database
    const fieldMapping = {
      name: "name",
      phone: "phone",
      address: "address",
      class: "class",
      major: "major",
    };

    // Filter field yang ada di DTO
    const updates = Object.entries(dto)
      .filter(([key]) => key in fieldMapping)
      .map(([key, value]) => ({
        field: fieldMapping[key as keyof typeof fieldMapping],
        value,
      }));

    if (!updates.length) return null;

    // Bangun query dan values
    const fields = updates.map((update) => `${update.field} = ?`).join(", ");
    const values = [...updates.map((update) => update.value), id];

    const [result] = await mysqlPool.execute(`UPDATE members SET ${fields} WHERE id_member = ?`, values);

    if ((result as any).affectedRows === 0) return null;
    return this.getById(id);
  },

  // =========================
  // DELETE MEMBER
  // =========================
  async delete(id: string | number) {
    const [result] = await mysqlPool.execute(`DELETE FROM members WHERE id_member = ?`, [id]);

    return (result as any).affectedRows > 0;
  },
};
