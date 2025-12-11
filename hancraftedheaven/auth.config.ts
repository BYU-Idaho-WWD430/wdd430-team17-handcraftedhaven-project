import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "@/app/login",
  },
  providers: [],
} satisfies NextAuthConfig;
