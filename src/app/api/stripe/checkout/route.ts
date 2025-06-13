import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build", {
  apiVersion: "2024-12-18.acacia" as const,
})

// Credit packages and pricing
const creditPackages = {
  starter: {
    credits: 15,
    amount: 499, // $4.99 in cents
    name: "Starter Plan",
    description: "15 high-quality AI photo transformations",
    isRecurring: true
  },
  standard: {
    credits: 35,
    amount: 999, // $9.99 in cents
    name: "Standard Plan",
    description: "35 high-quality AI photo transformations",
    isRecurring: true
  },
  pro: {
    credits: 60,
    amount: 1499, // $14.99 in cents
    name: "Pro Plan",
    description: "60 high-quality AI photo transformations",
    isRecurring: true
  },
  "quick-boost": {
    credits: 10,
    amount: 299, // $2.99 in cents
    name: "Quick Boost Pack",
    description: "10 bonus credits for your account",
    isRecurring: false
  },
  "power-pack": {
    credits: 25,
    amount: 699, // $6.99 in cents
    name: "Power Pack",
    description: "25 bonus credits for your account",
    isRecurring: false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_dummy_key_for_build") {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { packageType } = await request.json()

    if (!packageType || !creditPackages[packageType as keyof typeof creditPackages]) {
      return NextResponse.json(
        { error: "Invalid package type" },
        { status: 400 }
      )
    }

    const packageInfo = creditPackages[packageType as keyof typeof creditPackages]

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        purchaseType: packageType.toUpperCase().replace("-", "_") as "STARTER_PLAN" | "STANDARD_PLAN" | "PRO_PLAN" | "QUICK_BOOST_PACK" | "POWER_PACK",
        credits: packageInfo.credits,
        amount: packageInfo.amount / 100, // Convert cents to dollars
        paymentProvider: "stripe",
        paymentId: "", // Will be updated after payment
        status: "PENDING"
      }
    })

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageInfo.name,
              description: packageInfo.description
            },
            unit_amount: packageInfo.amount,
            ...(packageInfo.isRecurring && {
              recurring: {
                interval: 'month'
              }
            })
          },
          quantity: 1,
        },
      ],
      mode: packageInfo.isRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&package=${packageType}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        packageType,
        purchaseId: purchase.id,
        credits: packageInfo.credits.toString()
      }
    }

    // Add subscription-specific settings
    if (packageInfo.isRecurring) {
      sessionConfig.subscription_data = {
        metadata: {
          userId: user.id,
          packageType,
          credits: packageInfo.credits.toString()
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    // Update purchase with payment ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { paymentId: session.id }
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
