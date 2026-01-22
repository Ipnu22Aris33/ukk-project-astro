import type { APIRoute } from "astro";
import { z } from "zod";
import { mysqlPool } from "@lib/mysql";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { ok } from "@utils/apiResponse";
import { NotFound, InternalServerError } from "@utils/httpError";
import type { Member } from "@models/member";
import { hidePassword } from "@utils/hidePassword";
import { MemberCreateSchema } from "@models/member";

export const GET: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    // Parameter paginasi
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Query untuk data dengan paginasi
    const where = search ? `WHERE name LIKE ?` : "";
    const values = search ? [`%${search}%`] : [];

    // Query untuk mendapatkan total data
    const [totalRows] = await mysqlPool.query(`SELECT COUNT(*) as total FROM members ${where}`, values);
    const total = (totalRows as any)[0]?.total || 0;

    // Query untuk data dengan paginasi
    const paginationValues = [...values, limit, offset];
    const [rows] = await mysqlPool.query(
      `SELECT * FROM members ${where} ORDER BY id_member DESC LIMIT ? OFFSET ?`,
      paginationValues,
    );
    const result = rows as Member[];

    return ok(result, {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  });

export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, MemberCreateSchema);

    const [result] = await mysqlPool.execute(
      `INSERT INTO members (name, phone, address, class, major)
       VALUES (?, ?, ?, ?, ?)`,
      [body.name, body.phone, body.address, body.class, body.major],
    );

    const insertId = (result as any).insertId;

    const [rows] = await mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [insertId]);

    return ok((rows as Member[])[0]);
  });
