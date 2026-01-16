import type { User } from "@server/models/user";
import { mysqlPool } from "../config/mysql";

export const UserRepo = {
  async create(dto: Omit<User, "id_user">) {
    const [result] = await mysqlPool.execute(
      `INSERT INTO users (username, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [dto.username, dto.email, dto.password, dto.role]
    );

    return (result as any).insertId;
  },

  async getAll(filter: { search?: string | null }) {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter.search) {
      conditions.push("name LIKE ?");
      values.push(`%${filter.search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await mysqlPool.query(`SELECT * FROM users ${where}`, values);

    return rows as User[];
  },

  async getById(id: string) {
    const [rows] = await mysqlPool.query(`SELECT id_user, username, email, role FROM users WHERE id_user = ?`, [id]);

    return (rows as User[])[0] ?? null;
  },

  async getByEmail(email: string) {
    const [rows] = await mysqlPool.query(`SELECT * FROM users WHERE email = ?`, [email]);

    return (rows as User[])[0] ?? null;
  },

  async update(id: number, dto: Partial<Omit<User, "id_user">>) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.username) {
      fields.push("username = ?");
      values.push(dto.username);
    }
    if (dto.email) {
      fields.push("email = ?");
      values.push(dto.email);
    }
    if (dto.password) {
      fields.push("password = ?");
      values.push(dto.password);
    }
    if (dto.role) {
      fields.push("role = ?");
      values.push(dto.role);
    }

    if (!fields.length) return false;

    values.push(id);

    const [result] = await mysqlPool.execute(`UPDATE users SET ${fields.join(", ")} WHERE id_user = ?`, values);

    return (result as any).affectedRows > 0;
  },

  async updateSignIn(id: string) {
    const [result] = await mysqlPool.execute("UPDATE users SET sign_in_at = NOW() WHERE id_user = ?", [id]);

    return (result as any).affectedRows > 0;
  },

  async getUserProfileById(id: string) {
    const [rows] = await mysqlPool.query(
      `
    SELECT
      u.id_user,
      u.username,
      u.email,
      u.password,
      u.role,
      u.sign_up_at,
      u.sign_in_at,
      u.sign_out_at,

      m.id_member,
      m.user_id,
      m.name,
      m.phone,
      m.address,
      m.class,
      m.major

    FROM users u
    LEFT JOIN members m
      ON m.user_id = u.id_user
      AND u.role = 'member'

    WHERE u.id_user = ?
    `,
      [id]
    );

    return (rows as any[])[0] ?? null;
  },

  async updateSignOut(id: string) {
    const [result] = await mysqlPool.execute("UPDATE users SET sign_out_at = NOW() WHERE id_user = ?", [id]);
    return (result as any).affectedRows > 0;
  },

  async delete(id: string) {
    const [result] = await mysqlPool.execute(`DELETE FROM users WHERE id_user = ?`, [id]);

    return (result as any).affectedRows > 0;
  },
};
