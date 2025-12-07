import { type DefaultSession, type User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extiende la sesión para incluir las propiedades personalizadas.
   */
  interface Session {
    user: {
      id: string;
      firstname: string;
      user_type: "user" | "seller" | "admin";
    } & DefaultSession["user"];
  }

  /**
   * Extiende el usuario para incluir las propiedades personalizadas.
   */
  interface User {
    id: string;
    firstname: string;
    user_type: "user" | "seller" | "admin";
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende el token JWT para incluir las propiedades personalizadas.
   */
  interface JWT {
    id: string;
    firstname: string;
    user_type: "user" | "seller" | "admin";
  }
}