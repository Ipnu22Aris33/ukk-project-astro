import type { APIRoute } from "astro";
import { z } from "zod";
import { mysqlPool } from "@lib/mysql";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { ok } from "@utils/apiResponse";
import { NotFound, InternalServerError } from "@utils/httpError";
import type { Member } from "@server/models/member";

const memberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  class: z.string().min(1),
  major: z.string().min(1),
});

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    const where = search ? `WHERE name LIKE ?` : "";
    const values = search ? [`%${search}%`] : [];

    const [rows] = await mysqlPool.query(`SELECT * FROM members ${where} ORDER BY id_member DESC`, values);

    return ok(rows as Member[]);
  });

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, memberSchema);

    const [result] = await mysqlPool.execute(
      `INSERT INTO members (name, phone, address, class, major)
       VALUES (?, ?, ?, ?, ?)`,
      [body.name, body.phone, body.address, body.class, body.major],
    );

    const insertId = (result as any).insertId;

    const [rows] = await mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [insertId]);

    return ok((rows as Member[])[0]);
  });
