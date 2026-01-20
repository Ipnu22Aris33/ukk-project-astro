import type { APIRoute } from "astro";
import { mysqlPool } from "@lib/mysql";
import { type Member } from "@models/member";
import { type Admin } from "@models/admin";
import { NotFound } from "@utils/httpError";
import { ok } from "@utils/apiResponse";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const [memberRaw, adminRaw] = await Promise.all([
    mysqlPool.query(`SELECT * FROM admins WHERE id_admin = ?`, [locals.user.sub]),
    mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [locals.user.sub]),
  ]);

  const admin = (adminRaw[0] as Admin[])[0] ?? null;
  const member = (memberRaw[0] as Member[])[0] ?? null;

  const user = admin || member;
  if (!user) throw new NotFound("User not found");
  const { password, ...safeUser } = user;

  return new Response(JSON.stringify(ok(safeUser)), { headers: { "Content-Type": "application/json" } });
};
