import { type DefaultSession, type User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the default session type to include custom user properties.
   */
  interface Session {
    user: {
      id: string;
      firstname: string;
      user_type: "user" | "seller" | "admin";
    } & DefaultSession["user"];
  }

  /**
   * Extends the User object returned by NextAuth to include custom fields.
   */
  interface User {
    id: string;
    firstname: string;
    user_type: "user" | "seller" | "admin";
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT payload to ensure custom properties persist across requests.
   */
  interface JWT {
    id: string;
    firstname: string;
    user_type: "user" | "seller" | "admin";
  }
}