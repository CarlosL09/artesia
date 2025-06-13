import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create user with no password initially (will be set after payment)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        isEmailVerified: false,
        needsPasswordChange: true,
        // User starts with FREE_TRIAL and 3 credits by default
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
