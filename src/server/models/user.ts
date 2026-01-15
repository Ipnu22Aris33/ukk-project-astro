export interface User {
  id_user: string;
  username: string;
  email: string;
  password: string;
  role: "member" | "admin";
  sign_up_at: Date;
  sign_in_at: Date | null;
  sign_out_at: Date | null;
}
