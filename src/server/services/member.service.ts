import { MemberRepo } from "@server/repositories/member.repo";
import type { Member } from "@models/member";
import { InternalServerError, NotFound } from "@utils/httpError";
import { ok } from "@utils/apiResponse";

export const MemberService = {
  async create(dto: Omit<Member, "id_member">) {
    const data = await MemberRepo.create(dto);
    if (!data) {
      throw new InternalServerError();
    }
    return ok(data);
  },

  async update(id: string, dto: Partial<Omit<Member, "id_member">>) {
    const updated = await MemberRepo.update(id, dto);
    if (!updated) {
      throw new InternalServerError();
    }
    return ok(updated);
  },

  async getById(id: string) {
    const data = await MemberRepo.getById(id);
    if (!data) {
      throw new NotFound();
    }
    return ok(data);
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await MemberRepo.getAll(filter);
    return ok(datas);
  },

  async delete(id: string) {
    const deleted = await MemberRepo.delete(id);
    if (!deleted) {
      throw new InternalServerError();
    }
    return ok(deleted);
  },
};
