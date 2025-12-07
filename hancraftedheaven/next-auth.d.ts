import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extiende la sesión para incluir las propiedades personalizadas.
   */
  interface Session {
    user: {
      id: string;
      firstname: string;
      user_type: "user" | "seller";
    } & DefaultSession["user"];
  }
}