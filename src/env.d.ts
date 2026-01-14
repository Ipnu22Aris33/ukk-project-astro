/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    member?: {
      memberId: string | number;
      email: string;
      role: "admin" | "user";
    };
  }
}
