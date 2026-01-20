export interface Admin {
  id_admin: string;
  username: string;
  email: string;
  password: string;
  sign_up_at: Date;
  sign_in_at: Date | null;
  sign_out_at: Date | null;
}
