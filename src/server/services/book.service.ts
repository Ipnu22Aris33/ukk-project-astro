import { BooksRepo } from "@server/repositories/book.repo";
import type { Book } from "@server/models/book";
import { successResponse, errorResponse } from "@utils/response";
import { HttpError } from "@utils/httpError";

export const BooksService = {
  async create(dto: Omit<Book, "id">) {
    const created = await BooksRepo.create(dto);
    if (!created) {
      throw new HttpError(500, "ggal create");
    }
    return successResponse(created, "Buku berhasil dibuat");
  },

  async update(id: string, dto: Partial<Omit<Book, "id">>) {
    const updated = await BooksRepo.update(id, dto);
    if (!updated) {
      throw new HttpError(500, "gagal update");
    }
    return updated;
  },

  async getById(id: string) {
    const data = await BooksRepo.getById(id);
    if (!data) {
      throw new HttpError(404, "Buku tidak ditemukan");
    }
    return data;
  },

  async getAll() {
    const datas = await BooksRepo.getAll();
    return successResponse(datas, "Data buku berhasil diambil");
  },

  async delete(id: string) {
    const deleted = await BooksRepo.delete(id);
    if (!deleted) {
      throw new HttpError(500, "gagal cuy");
    }
    return successResponse(deleted, "Buku berhasil dihapus");
  },
};
