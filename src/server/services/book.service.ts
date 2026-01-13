import { BooksRepo } from "@server/repositories/book.repo";
import type { Book } from "@server/models/book";
import { HttpError } from "@utils/httpError";
import { created, ok } from "@utils/apiResponse";

export const BooksService = {
  async create(dto: Omit<Book, "id">) {
    const data = await BooksRepo.create(dto);
    if (!data) {
      throw new HttpError(500, "ggal create");
    }
    return created(data, "Buku berhasil dibuat");
  },

  async update(id: string, dto: Partial<Omit<Book, "id">>) {
    const updated = await BooksRepo.update(id, dto);
    if (!updated) {
      throw new HttpError(500, "gagal update");
    }
    return ok(updated, "data berhasil di perbarui");
  },

  async getById(id: string) {
    const data = await BooksRepo.getById(id);
    if (!data) {
      throw new HttpError(404, "Buku tidak ditemukan");
    }
    return ok(data, "data ada");
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await BooksRepo.getAll(filter);
    return ok(datas, "Data buku berhasil diambil");
  },

  async delete(id: string) {
    const deleted = await BooksRepo.delete(id);
    if (!deleted) {
      throw new HttpError(500, "gagal cuy");
    }
    return ok(deleted, "data berhasil dihapus");
  },
};
