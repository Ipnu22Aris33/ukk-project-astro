import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MemberRepo } from "@server/repositories/member.repo";
import { ok } from "@utils/apiResponse";
const JWT_SECRET = import.meta.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

type SignInPayload = {
  email: string;
  password: string;
};

type AuthPayload = {
  memberId: string | number;
  email: string;
  role: "admin" | "user";
};

export const AuthService = {
  async signIn(payload: SignInPayload) {
    const { email, password } = payload;

    const member = await MemberRepo.getByEmail(email);
    if (!member) {
      throw new Error("Email atau password tidak ditemukan");
    }
    // const isPasswordValid = await bcrypt.compare(password, member.password);
    if (password != member.password) {
      throw new Error("Email atau password salah");
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
