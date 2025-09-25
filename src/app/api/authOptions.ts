import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { parseUserAgent, generateSessionToken } from "@/lib/session-utils";

const prisma = new PrismaClient();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValidPassword = await argon2.verify(user.password, credentials.password);
        if (!isValidPassword) return null;
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        
        // Při prvním přihlášení vytvořit session záznam
        if (account && account.provider === "credentials") {
          try {
            const sessionToken = generateSessionToken();
            const userAgent = parseUserAgent(token.userAgent || '');
            
            // Use raw SQL to create session
            await prisma.$executeRaw`
              INSERT INTO "UserSession" (
                id, "userId", token, "userAgent", "ipAddress", location, 
                "isActive", "lastActivity", "createdAt", "expiresAt"
              ) VALUES (
                gen_random_uuid(), ${user.id}, ${sessionToken}, ${userAgent}, 
                ${token.ipAddress || 'Unknown'}, 'Česká republika', true, NOW(), NOW(), 
                NOW() + INTERVAL '30 days'
              )
            `;
            
            token.sessionToken = sessionToken;
          } catch (error) {
            console.error('Error creating session:', error);
          }
        }
      }
      
      // Při update session načti aktuální data z databáze
      if (trigger === "update" && token.id) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true, name: true, email: true, role: true }
        });
        
        if (updatedUser) {
          token.name = updatedUser.name;
          token.email = updatedUser.email;
          token.role = updatedUser.role;
        }
      }
      
      // Pokud je předán session update z klienta, použij ty hodnoty
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }
      
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
};