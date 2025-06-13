import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Palette, Zap, Shield, Star, Clock, Camera, Users, Infinity as InfinityIcon, Crown, Gift } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Artesia
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition">Pricing</a>
            <a href="#examples" className="text-gray-300 hover:text-purple-400 transition">Examples</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-purple-400" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" asChild>
              <Link href="/auth/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-purple-900/50 border-purple-600 text-purple-200">
            <Sparkles className="h-4 w-4 mr-2" />
            50+ Professional AI Styles
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight">
            Transform Your Photos
            <br />
            into Art
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Upload your photo, choose from <span className="text-purple-400 font-semibold">50+ styles</span> — from Pixar to painting, cartoon to cinematic — and let AI turn your image into a work of art.
          </p>
          <p className="text-xl text-purple-300 mb-12 font-medium">
            <strong>One click. Infinite styles.</strong>
          </p>

          {/* Free Trial CTA */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-600/50 rounded-2xl p-8 mb-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">🧧 Get Started FREE</h3>
            <div className="space-y-3 text-left max-w-md mx-auto mb-6">
              <div className="flex items-center text-green-400">
                <Star className="h-5 w-5 mr-3" />
                <span>Your first 3 transformations are 100% free</span>
              </div>
              <div className="flex items-center text-green-400">
                <Shield className="h-5 w-5 mr-3" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center text-green-400">
                <Clock className="h-5 w-5 mr-3" />
                <span>Takes just seconds</span>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-2xl shadow-purple-500/30" asChild>
              <Link href="/dashboard">
                <Camera className="mr-2 h-6 w-6" />
                Upload My Photo & Get 3 Free
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-6" asChild>
              <Link href="#pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">🪄 Pure AI Magic</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional-grade photo transformation with cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/80 border-gray-700 shadow-2xl">
              <CardHeader>
                <Palette className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">50+ Art Styles</CardTitle>
                <CardDescription className="text-gray-300">
                  From Pixar animations to Renaissance paintings, oil art to cyberpunk — every style you can imagine
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900/80 border-gray-700 shadow-2xl">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-300">
                  Get your transformed photos in seconds with our optimized AI processing pipeline
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900/80 border-gray-700 shadow-2xl">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Privacy First</CardTitle>
                <CardDescription className="text-gray-300">
                  We don't store your photos. Ever. Your privacy is guaranteed with every transformation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">🚀 Choose Your Plan</h2>
            <p className="text-xl text-gray-300">Start creating instantly. Credits never expire.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Starter Plan */}
            <Card className="bg-gradient-to-b from-gray-900 to-gray-800 border-gray-600 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">🥉 Starter Plan</CardTitle>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">$4.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-center text-gray-300">
                  Perfect for light use & fun shares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-green-400">
                    <Star className="h-4 w-4 mr-2" />
                    15 High-Quality Credits
                  </li>
                  <li className="flex items-center text-purple-300">
                    <Zap className="h-4 w-4 mr-2" />
                    Try new styles on your profile pics
                  </li>
                  <li className="flex items-center text-purple-300">
                    <Clock className="h-4 w-4 mr-2" />
                    Credits never expire
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" asChild>
                  <Link href="/auth/signup">Start Creating</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Standard Plan */}
            <Card className="bg-gradient-to-b from-purple-900 to-purple-800 border-purple-500 shadow-2xl relative transform scale-105">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                🔥 Most Popular
              </Badge>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">🥈 Standard Plan</CardTitle>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <CardDescription className="text-center text-purple-200">
                  Ideal for social users and content creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-green-400">
                    <Star className="h-4 w-4 mr-2" />
                    35 High-Quality Credits
                  </li>
                  <li className="flex items-center text-orange-300">
                    <Crown className="h-4 w-4 mr-2" />
                    Just 28¢ per transformation!
                  </li>
                  <li className="flex items-center text-purple-200">
                    <Users className="h-4 w-4 mr-2" />
                    Perfect for social media content
                  </li>
                  <li className="flex items-center text-purple-200">
                    <InfinityIcon className="h-4 w-4 mr-2" />
                    Credits never expire
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-yellow-900 to-orange-900 border-yellow-500 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">🥇 Pro Plan</CardTitle>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">$14.99</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <CardDescription className="text-center text-yellow-200">
                  Best for creators, streamers, and influencers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-green-400">
                    <Star className="h-4 w-4 mr-2" />
                    60 High-Quality Credits
                  </li>
                  <li className="flex items-center text-yellow-300">
                    <Crown className="h-4 w-4 mr-2" />
                    Maximum value at just 25¢ per image
                  </li>
                  <li className="flex items-center text-yellow-200">
                    <Zap className="h-4 w-4 mr-2" />
                    Priority processing
                  </li>
                  <li className="flex items-center text-yellow-200">
                    <InfinityIcon className="h-4 w-4 mr-2" />
                    Credits never expire
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white" asChild>
                  <Link href="/auth/signup">Unlock Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Add-On Packs */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">💡 Need More? Add-On Packs Available Anytime</h3>
            <p className="text-gray-300 mb-8">Perfect for bursts of creativity or special projects!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-blue-400" />
                  Quick Boost Pack
                </CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">$2.99</span>
                  <span className="text-gray-400"> for 10 credits</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/auth/signup">Add Quick Boost</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-800 to-purple-900 border-purple-500 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-400" />
                  Power Pack
                </CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">$6.99</span>
                  <span className="text-gray-300"> for 25 credits</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                  <Link href="/auth/signup">Add Power Pack</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <InfinityIcon className="h-12 w-12 text-purple-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">🔁 Credits Never Expire</h4>
                <p className="text-gray-300">Use them anytime. No pressure.</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-green-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">🔒 Your Privacy, Guaranteed</h4>
                <p className="text-gray-300">We don't store your photos. Ever.</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">⚡ Instant Results</h4>
                <p className="text-gray-300">Professional quality in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4 text-white">🚀 Start Free — Upgrade When You're Ready</h2>
          <p className="text-xl mb-8 text-purple-100">
            🔓 Unlock more styles, HD outputs, and creative freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-2xl shadow-purple-500/30" asChild>
              <Link href="/dashboard">
                <Camera className="mr-2 h-6 w-6" />
                Upload My Photo & Get 3 Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-300 text-purple-100 hover:bg-purple-800 text-lg px-8 py-6" asChild>
              <Link href="#pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Palette className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">Artesia</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition">Terms of Service</a>
              <a href="/contact" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Artesia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
