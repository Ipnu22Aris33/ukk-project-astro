import { z } from "zod";

/* =====================
   ENTITY (DB / RESPONSE)
===================== */
export interface Member {
  id_member: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  class: string;
  major: string;
}

/* =====================
   CREATE DTO
===================== */
export const MemberCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  class: z.string().min(1),
  major: z.string().min(1),
});

export type MemberCreate = z.infer<typeof MemberCreateSchema>;

/* =====================
   UPDATE DTO (optional)
===================== */
export const MemberUpdateSchema = MemberCreateSchema.partial();
export type MemberUpdate = z.infer<typeof MemberUpdateSchema>;
