import type { Member } from "@server/models/member";
import { mysqlPool } from "../config/mysql";

export const MemberRepo = {
  // =========================
  // CREATE MEMBER
  // =========================
  async create(dto: Omit<Member, "id_member">) {
    const [result] = await mysqlPool.execute(
      `
      INSERT INTO members 
      (user_id, name, phone, address, class, major)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [dto.user_id, dto.name, dto.phone, dto.address, dto.class, dto.major]
    );

    const insertId = (result as any).insertId;

    return this.getById(insertId);
  },

  // =========================
  // GET ALL MEMBERS
  // =========================
  async getAll(filter?: { search?: string | null }) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter?.search) {
      conditions.push("m.name LIKE ?");
      values.push(`%${filter.search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await mysqlPool.query(
      `
      SELECT 
        m.id_member,
        m.user_id,
        m.name,
        m.phone,
        m.address,
        m.class,
        m.major
      FROM members m
      ${where}
      ORDER BY m.id_member DESC
      `,
      values
    );

    return rows as Member[];
  },

  // =========================
  // GET MEMBER BY ID
  // =========================
  async getById(id: string | number) {
    const [rows] = await mysqlPool.query(
      `
      SELECT 
        id_member,
        user_id,
        name,
        phone,
        address,
        class,
        major
      FROM members
      WHERE id_member = ?
      `,
      [id]
    );

    return (rows as Member[])[0] ?? null;
  },

  // =========================
  // GET MEMBER BY USER ID
  // =========================
  async getByUserId(userId: string) {
    const [rows] = await mysqlPool.query(
      `
      SELECT 
        id_member,
        user_id,
        name,
        phone,
        address,
        class,
        major
      FROM members
      WHERE user_id = ?
      `,
      [userId]
    );

    return (rows as Member[])[0] ?? null;
  },

  // =========================
  // GET FULL PROFILE (JOIN USERS)
  // =========================
  async getProfileByUserId(userId: string) {
    const [rows] = await mysqlPool.query(
      `
      SELECT
        m.id_member,
        m.name,
        m.phone,
        m.address,
        m.class,
        m.major,
        u.id_user,
        u.username,
        u.email,
        u.role
      FROM members m
      JOIN users u ON u.id_user = m.user_id
      WHERE u.id_user = ?
      `,
      [userId]
    );

    return (rows as any[])[0] ?? null;
  },

  // =========================
  // UPDATE MEMBER
  // =========================
  async update(id: string, dto: Partial<Omit<Member, "id_member" | "user_id">>) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.name) {
      fields.push("name = ?");
      values.push(dto.name);
    }
    if (dto.phone) {
      fields.push("phone = ?");
      values.push(dto.phone);
    }
    if (dto.address) {
      fields.push("address = ?");
      values.push(dto.address);
    }
    if (dto.class) {
      fields.push("class = ?");
      values.push(dto.class);
    }
    if (dto.major) {
      fields.push("major = ?");
      values.push(dto.major);
    }

    if (!fields.length) return null;

    values.push(id);

    const [result] = await mysqlPool.execute(
      `
      UPDATE members 
      SET ${fields.join(", ")}
      WHERE id_member = ?
      `,
      values
    );

    if ((result as any).affectedRows === 0) return null;

    return this.getById(id);
  },

  // =========================
  // DELETE MEMBER
  // =========================
  async delete(id: string) {
    const [result] = await mysqlPool.execute("DELETE FROM members WHERE id_member = ?", [id]);

    return (result as any).affectedRows > 0;
  },
};
