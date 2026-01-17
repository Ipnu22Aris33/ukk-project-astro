import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AdminRepo } from "@server/repositories/admin.repo";
import { MemberRepo } from "@server/repositories/member.repo";
import { NotFound, BadRequest, InternalServerError } from "@utils/httpError";
import { ok } from "@utils/apiResponse";

const JWT_SECRET = import.meta.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = import.meta.env.JWT_EXPIRES_IN;

interface TokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: "admin" | "member";
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  class: string;
  major: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface CreateAdminPayload {
  username: string;
  email: string;
  password: string;
}

export const AuthService = {
  async signUp(p: SignUpPayload) {
    const hashedPassword = await bcrypt.hash(p.password, 10);
    const sign = await MemberRepo.create({
      password: hashedPassword,
      name: p.name,
      email: p.email,
      phone: p.phone,
      address: p.address,
      class: p.class,
      major: p.major,
    });
    if (!sign) throw new InternalServerError();
    const {password, ...safe} = sign
    return ok(safe);
  },
  async signIn(p: SignInPayload) {
    const { email, password } = p;

    const [admin, member] = await Promise.all([AdminRepo.getByEmail(email), MemberRepo.getByEmail(email)]);

    if (admin) {
      // Handle admin
      // const isValid = await bcrypt.compare(password, admin.password);
      // if (!isValid) throw new BadRequest("Invalid password");

      //   if (admin.isActive === false) throw new BadRequest("Account deactivated");

      const token = jwt.sign(
        {
          sub: admin.id_admin,
          email: admin.email,
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      const { password: _, ...adminData } = admin;
      return ok({ user: adminData, token });
    }

    if (member) {
      const isValid = await bcrypt.compare(password, member.password);
      if (!isValid) throw new BadRequest("member Invalid password");

      //   if (member.isActive === false) throw new BadRequest("Account deactivated");
      //   if (member.status === "pending") throw new BadRequest("Account pending verification");

      const token = jwt.sign(
        {
          sub: member.id_member,
          email: member.email,
          role: "member",
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      const { password: _, ...memberData } = member;
      return ok({ user: memberData, token });
    }

    throw new NotFound("User not found");
  },
  async signOut() {},
  async getMyProfile(id: string) {
    const [admin, member] = await Promise.all([AdminRepo.getById(id), MemberRepo.getById(id)]);
    const user = admin || member;
    if (!user) throw new NotFound();
    const { password, ...safe } = user;
    return ok(safe);
  },
  async createAdmin(p: CreateAdminPayload) {
    const { username, email, password } = p;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await AdminRepo.create({
      username,
      email,
      password: hashedPassword,
    });
  },
  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

      return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      throw new Error("Invalid or expired token");
    }
  },
};
