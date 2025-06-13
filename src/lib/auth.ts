import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"

export async function getSession() {
  return await getServerSession()
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return user
}
