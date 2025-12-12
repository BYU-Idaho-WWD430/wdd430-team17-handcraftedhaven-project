import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "./prisma"; // Reuse Prisma client instance

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate the received credentials using Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          // Compare provided password with stored hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Fetch user from the database using Prisma
            return {
              id: user.user_id,
              email: user.email,
              firstname: user.firstname,
              user_type: user.user_type,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // When a user logs in, merge user data into the JWT token
        token.id = user.id;
        token.firstname = user.firstname;
        token.user_type = user.user_type;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token information inside the session object
      session.user.id = token.id as string;
      session.user.firstname = token.firstname as string;
      session.user.user_type = token.user_type as "user" | "seller";
      return session;
    },
  },
});
