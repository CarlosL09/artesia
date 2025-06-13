import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Build-safe NextAuth config
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo mode - accept any credentials
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
  secret: process.env.NEXTAUTH_SECRET || "demo-secret-key-12345",
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
})

export { handler as GET, handler as POST }
