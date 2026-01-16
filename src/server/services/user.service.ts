import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRepo } from "@server/repositories/user.repo";
import { ok } from "@utils/apiResponse";
import { BadRequest, NotFound } from "@utils/httpError";

const JWT_SECRET = import.meta.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = import.meta.env.JWT_EXPIRES_IN;

type SignInPayload = {
  email: string;
  password: string;
};

type AuthPayload = {
  userId: string;
  email: string;
  role: "admin" | "member";
};

export const UserService = {
  async getMyProfile(userId: string) {
    const user = await UserRepo.getUserProfileById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    const { password, ...safeUser } = user;

    return ok(safeUser, "data user ok");
  },

  async signIn(payload: SignInPayload) {
    const { email, password } = payload;

    if (!email || email.trim() === "") {
      throw new BadRequest("Email is required");
    }

    // if (!password || password.trim() === "") {
    //   throw new BadRequest("Password is required");
    // }

    const user = await UserRepo.getByEmail(email);
    if (!user) {
      throw new NotFound("Email not found");
    }

    // const isValid = await bcrypt.compare(password, user.password);
    // if (!isValid) {
    //   throw new BadRequest("Password invalid");
    // }

    const token = jwt.sign(
      {
        userId: user.id_user,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // optional: update last sign in
    await UserRepo.updateSignIn(user.id_user);

    return ok(
      {
        token,
        user: {
          id: user.id_user,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      "Sign in berhasil"
    );
  },

  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      throw new Error("Invalid or expired token");
    }
  },
};
