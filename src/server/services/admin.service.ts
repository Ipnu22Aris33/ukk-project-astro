import { AdminRepo } from "@server/repositories/admin.repo";
import type { Admin } from "@server/models/admin";
import { InternalServerError, NotFound } from "@utils/httpError";

export const AdminService = {
  async create(dto: Omit<Admin, "id_admin">) {
    const data = await AdminRepo.create(dto);
    if (!data) {
      throw new InternalServerError();
    }
    return data;
  },

  async update(id: string, dto: Partial<Omit<Admin, "id_admin">>) {
    const updated = await AdminRepo.update(id, dto);
    if (!updated) {
      throw new InternalServerError();
    }
    return updated;
  },

  async getById(id: string) {
    const data = await AdminRepo.getById(id);
    if (!data) {
      throw new NotFound();
    }
    return data;
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await AdminRepo.getAll(filter);
    return datas;
  },

  async delete(id: string) {
    const deleted = await AdminRepo.delete(id);
    if (!deleted) {
      throw new InternalServerError();
    }
    return deleted;
  },
};
