import { z } from "zod";

export interface Book {
  id_book: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  stock: number;
}

export const BookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  category: z.string().min(1),
  stock: z.number().min(0),
});
