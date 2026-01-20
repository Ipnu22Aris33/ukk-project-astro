import { LoanRepo } from "@server/repositories/loan.repo";
import type { Loan } from "@server/models/loan";
import { InternalServerError, NotFound } from "@utils/httpError";
import { ok } from "@utils/apiResponse";

export const MemberService = {
  async create(dto: Omit<Loan, "id_member">) {
    const data = await LoanRepo.create(dto);
    if (!data) {
      throw new InternalServerError();
    }
    return ok(data);
  },

  async update(id: string, dto: Partial<Omit<Loan, "id_member">>) {
    const updated = await LoanRepo.update(id, dto);
    if (!updated) {
      throw new InternalServerError();
    }
    return ok(updated);
  },

  async getById(id: string) {
    const data = await LoanRepo.getById(id);
    if (!data) {
      throw new NotFound();
    }
    return ok(data);
  },

  async getAll(filter: { search?: string | null; category?: string | null }) {
    const datas = await LoanRepo.getAll(filter);
    return ok(datas);
  },

  async delete(id: string) {
    const deleted = await LoanRepo.delete(id);
    if (!deleted) {
      throw new InternalServerError();
    }
    return ok(deleted);
  },
};
