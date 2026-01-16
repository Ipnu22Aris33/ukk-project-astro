import { BooksRepo } from "@server/repositories/book.repo";
import type { Book } from "@server/models/book";
import { InternalServerError, NotFound } from "@utils/httpError";

export const BooksService = {
  async create(dto: Omit<Book, "id">) {
    const data = await BooksRepo.create(dto);
    if (!data) {
      throw new InternalServerError();
    }
    return data;
  },

  async update(id: string, dto: Partial<Omit<Book, "id">>) {
    const updated = await BooksRepo.update(id, dto);
    if (!updated) {
      throw new InternalServerError();
    }
    return updated;
  },

  async getById(id: string) {
    const data = await BooksRepo.getById(id);
    if (!data) {
      throw new NotFound();
    }
    return data;
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await BooksRepo.getAll(filter);
    return datas;
  },

  async delete(id: string) {
    const deleted = await BooksRepo.delete(id);
    if (!deleted) {
      throw new InternalServerError();
    }
    return deleted;
  },
};
