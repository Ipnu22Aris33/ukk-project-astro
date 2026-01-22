import { z } from "zod";

export interface Loan {
  id_loan: string;
  member_id: string;
  admin_id: string;
  book_id: string;
  count: number;
  loan_date: Date;
  due_date: Date;
  return_date: Date | null;
  status: string;
}

// models/loan.ts
export const LoanSchema = z.object({
  member_id: z.string().min(1),
  admin_id: z.string().min(1),
  book_id: z.string().min(1),
  count: z.number(),
  loan_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
    .transform((date) => new Date(date)),
  due_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
    .transform((date) => new Date(date)),
  // ✅ PERBAIKAN: Gunakan .optional() .nullable() dan .transform() yang benar
  return_date: z
    .union([z.string(), z.null()]) // Bisa string atau null
    .optional()
    .refine((date) => date === null || date === undefined || !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .transform((date) => (date ? new Date(date) : null)),
  status: z.string().min(1),
});

export type LoanCreate = z.infer<typeof LoanSchema>;
