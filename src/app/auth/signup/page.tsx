"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      toast.success("Account created! Please choose a plan to get started.")
      router.push("/pricing")

    } catch (error: unknown) {
      console.error('Sign up error:', error)
      toast.error(error instanceof Error ? error.message : "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Palette className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Artesia
            </span>
          </Link>
        </div>

        <Card className="bg-gray-900/80 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Create your account</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Start your free trial and transform your photos into amazing AI art
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-purple-900/30 border border-purple-600/50 rounded-lg mb-6">
              <h3 className="font-semibold text-purple-200 mb-2">🎉 Free Trial Includes:</h3>
              <ul className="text-sm text-purple-300 space-y-1">
                <li>• 3 photo conversions</li>
                <li>• All art styles included</li>
                <li>• High resolution downloads</li>
                <li>• No credit card required</li>
              </ul>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? "Creating Account..." : "Create Account & Continue"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-purple-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-purple-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-purple-400 hover:underline">
            Privacy Policy
          </Link>
        </div>

        <div className="text-center mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-2">How it works:</h4>
          <ol className="text-sm text-gray-300 space-y-1 text-left">
            <li>1. Create your free account</li>
            <li>2. Choose a plan and make payment</li>
            <li>3. Receive your password via email</li>
            <li>4. Sign in and start creating!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
