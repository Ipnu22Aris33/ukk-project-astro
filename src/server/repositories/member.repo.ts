import type { Member } from "@server/models/member";
import { mysqlPool } from "../config/mysql";

export const MemberRepo = {
  async create(dto: Omit<Member, "id_member">) {
    const [result] = await mysqlPool.execute(
      "INSERT INTO members (name, email, password, kelas, jurusan, role) VALUES (?, ?, ?, ?, ?, ?)",
      [dto.name, dto.email, dto.password, dto.class, dto.major, dto.role]
    );
    const insertId = (result as any).insertId;

    const [rows] = await mysqlPool.query(
      "SELECT * FROM members WHERE id_member = ?",
      [insertId]
    );

    return (rows as any[])[0];
  },

  async getAll(filter: { search?: string | null }) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter.search) {
      conditions.push("name LIKE ?");
      values.push(`%${filter.search}%`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `SELECT * FROM members ${where}`;

    const [rows] = await mysqlPool.query(sql, values);
    return rows;
  },

  async getById(id: string) {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM members WHERE id_member = ?",
      [id]
    );
    return (rows as Member[])[0] ?? null;
  },

  async update(id: string, dto: Partial<Omit<Member, "id_member">>) {
    const [result] = await mysqlPool.execute(
      "UPDATE members SET name = ?, email = ?, password = ?, kelas = ?, jurusan = ?, role = ? WHERE id_member = ?",
      [dto.name, dto.email, dto.password, dto.class, dto.major, dto.role, id]
    );
    if ((result as any).affectedRows === 0) return null;

    const [rows] = await mysqlPool.query(
      "SELECT * FROM members WHERE id_member = ?",
      [id]
    );

    return (rows as any[])[0];
  },

  async delete(id: string) {
    const [result] = await mysqlPool.execute(
      "DELETE FROM members WHERE id_member = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  },
};
