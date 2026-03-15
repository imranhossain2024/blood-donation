import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      agentArea?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    agentArea?: string | null;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


// ২. এনভায়রনমেন্ট ভেরিয়েবল থেকে আইডি এবং সিক্রেট নিয়ে গুগল কনফিগার করা
const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("Sign-in validation failed:", parsed.error);
            return null;
          }

          const { email, password } = parsed.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            console.error("Sign-in failed: user not found or missing passwordHash");
            return null;
          }

          const isValid = await compare(password, user.passwordHash);
          if (!isValid) {
            console.error("Sign-in failed: invalid password");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            agentArea: user.agentArea,
          };
        } catch (err) {
          console.error("Sign-in error:", err);
          return null;
        }
      },
    }),
    // ৩. প্রোভাইডার লিস্টে গুগল যোগ করা
    ...(googleProvider ? [googleProvider] : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.agentArea = user.agentArea;
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.agentArea = dbUser.agentArea;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.agentArea = token.agentArea;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
