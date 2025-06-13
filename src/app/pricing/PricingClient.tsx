"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Palette,
  Crown,
  Star,
  Zap,
  Shield,
  ArrowLeft,
  Key
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import PaymentButton from "@/components/PaymentButton"

type User = {
  id: string
  name: string | null
  email: string
  subscriptionType: string
  apiKey: string | null
}

export default function PricingClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiDialog, setShowApiDialog] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user?.email) {
      // Mock user for now
      const mockUser: User = {
        id: "1",
        name: session.user.name || null,
        email: session.user.email,
        subscriptionType: "FREE_TRIAL",
        apiKey: null
      }
      setUser(mockUser)
      setApiKey(mockUser.apiKey || "")
    }
  }, [status, session, router])

  const handleSubscribe = async (planType: 'monthly' | 'lifetime') => {
    setIsLoading(planType)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url

    } catch (error) {
      console.error('Subscription error:', error)
      toast.error("Failed to start checkout. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handleSaveApiKey = async () => {
    try {
      const response = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey })
      })

      if (!response.ok) {
        throw new Error('Failed to save API key')
      }

      toast.success("API key saved successfully!")
      setShowApiDialog(false)

    } catch (error) {
      console.error('API key error:', error)
      toast.error("Failed to save API key. Please try again.")
    }
  }

  const getSubscriptionBadge = () => {
    if (!user) return <Badge variant="secondary">Loading...</Badge>

    switch (user.subscriptionType) {
      case 'MONTHLY':
        return <Badge className="bg-purple-600"><Crown className="h-3 w-3 mr-1" />Monthly Active</Badge>
      case 'LIFETIME':
        return <Badge className="bg-yellow-600"><Crown className="h-3 w-3 mr-1" />Lifetime Active</Badge>
      case 'OWN_API_KEY':
        return <Badge variant="outline"><Zap className="h-3 w-3 mr-1" />Using Own API</Badge>
      default:
        return <Badge variant="secondary">Free Trial</Badge>
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Artesia
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {getSubscriptionBadge()}
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600">Upgrade to unlock unlimited AI art conversions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <Card className={`border-2 ${user.subscriptionType === 'FREE_TRIAL' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-center">Free Trial</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <CardDescription className="text-center">
                  Perfect for trying out our service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    3 photo conversions
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    All art styles included
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    High resolution downloads
                  </li>
                </ul>
                {user.subscriptionType === 'FREE_TRIAL' ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Not Available
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className={`border-2 relative ${user.subscriptionType === 'MONTHLY' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-500'}`}>
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-center">Monthly Plan</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-center">
                  For regular users and creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited conversions
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    All art styles included
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Priority processing
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Email support
                  </li>
                </ul>
                <PaymentButton
                  packageType="standard"
                  isCurrentPlan={user.subscriptionType === 'STANDARD'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                />
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card className={`border-2 ${user.subscriptionType === 'LIFETIME' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-yellow-500'}`}>
              <CardHeader>
                <CardTitle className="text-center">Lifetime Access</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600"> once</span>
                </div>
                <CardDescription className="text-center">
                  One-time payment, lifetime access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited conversions forever
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    All future art styles
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Priority processing
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-green-500 mr-2" />
                    Premium support
                  </li>
                </ul>
                <PaymentButton
                  packageType="pro"
                  isCurrentPlan={user.subscriptionType === 'PRO'}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                />
              </CardContent>
            </Card>
          </div>

          {/* Own API Key Option */}
          <div className="mt-12 text-center">
            <Card className={`max-w-2xl mx-auto border-2 ${user.subscriptionType === 'OWN_API_KEY' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-dashed border-gray-300'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Key className="mr-2 h-5 w-5" />
                  Use Your Own API Key
                </CardTitle>
                <CardDescription>
                  Have your own OpenAI API key? Use our platform with your own credits for maximum flexibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.apiKey && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <Shield className="inline h-4 w-4 mr-1" />
                        API key configured and active
                      </p>
                    </div>
                  )}

                  <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {user.apiKey ? 'Update API Key' : 'Connect Your API Key'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>OpenAI API Key</DialogTitle>
                        <DialogDescription>
                          Enter your OpenAI API key to use your own credits. Your key is stored securely and only used for your conversions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSaveApiKey} className="w-full">
                          Save API Key
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
