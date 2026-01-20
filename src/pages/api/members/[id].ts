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

export const PATCH: APIRoute = async ({ params, request }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    if (!id) throw new NotFound("ID tidak ditemukan");

    const body = await validateBody(request, memberSchema.partial());

    const fields = Object.keys(body)
      .map((key) => `${key} = ?`)
      .join(", ");

    if (!fields) throw new InternalServerError("Tidak ada data diupdate");

    const values = [...Object.values(body), id];

    const [result] = await mysqlPool.execute(`UPDATE members SET ${fields} WHERE id_member = ?`, values);

    if ((result as any).affectedRows === 0) throw new NotFound();

    const [rows] = await mysqlPool.query(`SELECT * FROM members WHERE id_member = ?`, [id]);

    return ok((rows as Member[])[0]);
  });

export const DELETE: APIRoute = async ({ params }) =>
  tryCatchApi(async () => {
    const id = String(params.id);

    if (!id) throw new NotFound("ID tidak ditemukan");

    const [result] = await mysqlPool.execute(`DELETE FROM members WHERE id_member = ?`, [id]);

    if ((result as any).affectedRows === 0) throw new NotFound();

    return ok(true);
  });
