import { type NextRequest, NextResponse } from "next/server"

// Simplified webhook handler that doesn't execute during build
export async function POST(request: NextRequest) {
  // Check if we're in build mode
  if (process.env.NODE_ENV === 'production' && (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_dummy_key_for_build")) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    )
  }

  return NextResponse.json({ received: true })
}
