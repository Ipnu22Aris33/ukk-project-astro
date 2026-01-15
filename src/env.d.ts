/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user?: {
      userId: string;
      email: string;
      role: "admin" | "member";
    };
  }
}
