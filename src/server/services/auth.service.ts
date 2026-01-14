import jwt, { type JwtPayload } from "jsonwebtoken";
import _bcrypt from "bcryptjs";
import { MemberRepo } from "@server/repositories/member.repo";
import { ok } from "@utils/apiResponse";
import { BadRequest, NotFound } from "@utils/httpError";
const JWT_SECRET = import.meta.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = import.meta.env.JWT_EXPIRES_IN;

type SignInPayload = {
  email: string;
  password: string;
};

type AuthPayload = {
  memberId: string;
  email: string;
  role: "admin" | "user";
};

export const AuthService = {
  async getMyProfile(memberId: string) {
    const member = await MemberRepo.getById(memberId);
    if (!member) {
      throw new NotFound("member not found");
    }
    return ok(member, "data member ok");
  },
  async signIn(payload: SignInPayload) {
    const { email, password } = payload;

    const member = await MemberRepo.getByEmail(email);

    if (!member) {
      throw new NotFound("Email not Found");
    }
    if (password != member.password) {
      throw new BadRequest("Password Invalid!!");
    }

    const token = jwt.sign(
      {
        memberId: member.id_member,
        email: member.email,
        role: member.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return ok(
      {
        token,
        user: {
          id: member.id_member,
          name: member.name,
          email: member.email,
        },
      },
      "Sign in berhasil"
    );
  },

  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthPayload;

      return {
        memberId: decoded.memberId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      throw new Error("Invalid or expired token");
    }
  },
};
