import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { apiKey } = await request.json()

    if (!apiKey || !apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: "Invalid API key format" },
        { status: 400 }
      )
    }

    // Encrypt the API key before storing
    const encryptedApiKey = await bcrypt.hash(apiKey, 12)

    // Update user with API key and change subscription type
    await prisma.user.update({
      where: { id: user.id },
      data: {
        apiKey: encryptedApiKey,
        subscriptionType: 'OWN_API_KEY'
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API key save error:', error)
    return NextResponse.json(
      { error: "Failed to save API key" },
      { status: 500 }
    )
  }
}
