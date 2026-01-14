/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    member?: {
      memberId: string;
      email: string;
      role: "admin" | "user";
    };
  }
}
