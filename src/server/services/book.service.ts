import { BooksRepo } from "@server/repositories/book.repo";
import type { Book } from "@models/book";
import { InternalServerError, NotFound } from "@utils/httpError";
import { ok } from "@utils/apiResponse";

export const BooksService = {
  async create(dto: Omit<Book, "id">) {
    const data = await BooksRepo.create(dto);
    if (!data) {
      throw new InternalServerError();
    }
    return ok(data);
  },

  async update(id: string, dto: Partial<Omit<Book, "id">>) {
    const updated = await BooksRepo.update(id, dto);
    if (!updated) {
      throw new InternalServerError();
    }
    return ok(updated);
  },

  async getById(id: string) {
    const data = await BooksRepo.getById(id);
    if (!data) {
      throw new NotFound();
    }
    return ok(data);
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await BooksRepo.getAll(filter);
    console.log(datas, "ini teko service")
    return ok(datas);
  },

  async delete(id: string) {
    const deleted = await BooksRepo.delete(id);
    if (!deleted) {
      throw new InternalServerError();
    }
    return ok(deleted);
  },
};
