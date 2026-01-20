import type { APIRoute } from "astro";
import z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mysqlPool } from "@lib/mysql";
import { tryCatchApi } from "@utils/tryCatchApi";
import { validateBody } from "@utils/validate";
import { ok } from "@utils/apiResponse";
import { BadRequest, NotFound } from "@utils/httpError";
import { type Admin } from "@server/models/admin";
import { type Member } from "@server/models/member";

const JWT_SECRET = import.meta.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = import.meta.env.JWT_EXPIRES_IN;

/* =========================
   SCHEMA
========================= */
const Schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/* =========================
   POST / SIGN IN
========================= */
export const POST: APIRoute = async ({ request }) =>
  tryCatchApi(async () => {
    const body = await validateBody(request, Schema);

    const [adminRaw, memberRaw] = await Promise.all([
      mysqlPool.query(`SELECT * FROM admins WHERE email = ?`, [body.email]),
      mysqlPool.query(`SELECT * FROM members WHERE email = ?`, [body.email]),
    ]);

    const admin = (adminRaw[0] as Admin[])[0] ?? null;
    const member = (memberRaw[0] as Member[])[0] ?? null;

    const user = admin || member;
    if (!user) throw new NotFound("User not found");

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) throw new BadRequest("Invalid password");

    const role = admin ? "admin" : "member";
    const sub = admin ? admin.id_admin : member.id_member;

    const token = jwt.sign({ sub, email: user.email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { password, ...safeUser } = user;

    return new Response(JSON.stringify(ok({ user: safeUser, token }).data), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
        "Content-Type": "application/json",
      },
    });
  });
