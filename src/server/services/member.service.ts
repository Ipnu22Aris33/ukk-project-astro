import { MemberRepo } from "@server/repositories/member.repo";
import type { Member } from "@server/models/member";
import { HttpError } from "@utils/httpError";
import { created, ok } from "@utils/apiResponse";

export const MembersService = {
  async create(dto: Omit<Member, "id_member">) {
    const data = await MemberRepo.create(dto);
    if (!data) {
      throw new HttpError(500, "ggal create");
    }
    return created(data, "Buku berhasil dibuat");
  },

  async update(id: string, dto: Partial<Omit<Member, "id_member">>) {
    const updated = await MemberRepo.update(id, dto);
    if (!updated) {
      throw new HttpError(500, "gagal update");
    }
    return ok(updated, "data berhasil di perbarui");
  },

  async getById(id: string) {
    const data = await MemberRepo.getById(id);
    if (!data) {
      throw new HttpError(404, "members tidak ditemukan");
    }
    return ok(data, "data ada");
  },

  async getAll(filter: { search?: string | null }) {
    const datas = await MemberRepo.getAll(filter);
    return ok(datas, "Data buku berhasil diambil");
  },

  async delete(id: string) {
    const deleted = await MemberRepo.delete(id);
    if (!deleted) {
      throw new HttpError(500, "gagal cuy");
    }
    return ok(deleted, "data berhasil dihapus");
  },
};
