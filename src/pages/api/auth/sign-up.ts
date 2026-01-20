import type { APIRoute } from "astro";
import z from "zod";
import bcrypt from "bcryptjs";
import { mysqlPool } from "@lib/mysql";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { ok } from "@utils/apiResponse";
import { InternalServerError } from "@utils/httpError";

/* =========================
   SCHEMA
========================= */
const Schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  address: z.string(),
  class: z.string(),
  major: z.string(),
});

/* =========================
   POST / SIGN UP
========================= */
export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, Schema);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const [result] = await mysqlPool.execute(
      `INSERT INTO members (name, email, password, phone, address, class, major)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [body.name, body.email, hashedPassword, body.phone, body.address, body.class, body.major],
    );

    const insertId = (result as any).insertId;
    if (!insertId) throw new InternalServerError();

    const [rows] = await mysqlPool.query(
      `SELECT id_member, name, email, phone, address, class, major
       FROM members WHERE id_member = ?`,
      [insertId],
    );

    return ok((rows as any[])[0]);
  });
