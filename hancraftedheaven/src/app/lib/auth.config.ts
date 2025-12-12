import type { NextAuthConfig } from "next-auth";

/* This is the login configuration for NextAuth.js */

export const authConfig = {
  pages: {
    signIn: "@/app/login",
  },
  providers: [],
} satisfies NextAuthConfig;
