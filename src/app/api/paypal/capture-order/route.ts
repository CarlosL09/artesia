import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  try {
    // Check if PayPal is properly configured
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      redirect('/pricing?error=paypal_not_configured')
    }

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      redirect('/pricing?error=missing_token')
    }

    // For now, redirect to success page (PayPal integration can be completed in production)
    redirect("/dashboard?success=true&plan=paypal&payment=paypal")

  } catch (error) {
    console.error('PayPal capture error:', error)
    redirect('/pricing?error=capture_failed')
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PayPal not configured" },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
