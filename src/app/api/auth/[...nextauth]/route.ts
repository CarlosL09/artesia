import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simplified NextAuth config for demo deployment (no database)
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo mode - accept any credentials for now
        if (credentials?.email && credentials?.password) {
          return {
            id: "demo-user",
            email: credentials.email,
            name: "Demo User",
          }
        }
        return null
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
