import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "./src/app/lib/prisma"; // Reutilizamos el cliente de Prisma

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Usamos el cliente de Prisma para obtener el usuario
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Devolvemos un objeto compatible con la sesión
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
        // Al iniciar sesión, el objeto 'user' está disponible para poblar el token
        token.id = user.id;
        token.firstname = user.firstname;
        token.user_type = user.user_type;
      }
      return token;
    },
    async session({ session, token }) {
      // Hacemos que los datos del token estén disponibles en el objeto de sesión
      session.user.id = token.id as string;
      session.user.firstname = token.firstname as string;
      session.user.user_type = token.user_type as "user" | "seller";
      return session;
    },
  },
});
