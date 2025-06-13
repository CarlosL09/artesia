"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PaymentButtonProps {
  packageType: 'starter' | 'standard' | 'pro' | 'quick-boost' | 'power-pack'
  isCurrentPlan?: boolean
  className?: string
}

export default function PaymentButton({
  packageType,
  isCurrentPlan = false,
  className = ""
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState<'stripe' | 'paypal' | null>(null)

  const handleStripePayment = async () => {
    setIsLoading('stripe')

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url

    } catch (error) {
      console.error('Stripe payment error:', error)
      toast.error("Failed to start checkout. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handlePayPalPayment = async () => {
    setIsLoading('paypal')

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create PayPal order')
      }

      const { approvalUrl } = await response.json()
      window.location.href = approvalUrl

    } catch (error) {
      console.error('PayPal payment error:', error)
      toast.error("Failed to start PayPal checkout. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  if (isCurrentPlan) {
    return (
      <Button className={`w-full ${className}`} disabled>
        Current Plan
      </Button>
    )
  }

  const getButtonText = () => {
    switch (packageType) {
      case 'starter':
        return 'Get Starter Plan'
      case 'standard':
        return 'Get Standard Plan'
      case 'pro':
        return 'Get Pro Plan'
      case 'quick-boost':
        return 'Add Quick Boost'
      case 'power-pack':
        return 'Add Power Pack'
      default:
        return 'Purchase'
    }
  }

  return (
    <div className="space-y-3">
      {/* Stripe Payment */}
      <Button
        onClick={handleStripePayment}
        disabled={isLoading !== null}
        className={`w-full ${className}`}
      >
        {isLoading === 'stripe' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {getButtonText()}
          </>
        )}
      </Button>

      {/* PayPal Payment */}
      <Button
        onClick={handlePayPalPayment}
        disabled={isLoading !== null}
        variant="outline"
        className="w-full border-[#ffc439] text-[#003087] hover:bg-[#ffc439] hover:text-[#003087]"
      >
        {isLoading === 'paypal' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.39A.773.773 0 0 1 5.706 1.8h6.552c1.205 0 2.381.135 3.358.562 1.23.539 1.968 1.513 1.968 3.075 0 2.626-2.114 4.292-5.18 4.292H9.278l-.86 5.608zm7.568-13.065c0-.798-.384-1.292-1.292-1.292H9.278l-.86 5.608h3.075c1.743 0 2.86-.798 2.86-2.382 0-.539-.135-1.205-.61-1.934z"/>
            </svg>
            Pay with PayPal
          </>
        )}
      </Button>

      <div className="text-center">
        <Badge variant="secondary" className="text-xs">
          Secure payment processing
        </Badge>
      </div>
    </div>
  )
}
