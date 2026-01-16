export const TOAST_MAP = {
  "login-success": {
    title: "Login berhasil",
    description: "Selamat datang kembali 👋",
    type: "success",
  },
  "login-failed": {
    title: "Login gagal",
    description: "Email atau password salah 😢",
    type: "error",
  },
  "member-added": {
    title: "Berhasil",
    description: "Member berhasil ditambahkan",
    type: "success",
  },
} as const;

export type ToastEvent = keyof typeof TOAST_MAP;
