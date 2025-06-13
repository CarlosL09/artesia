"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Upload,
  Palette,
  History,
  User as UserIcon,
  LogOut,
  Crown,
  Zap,
  Image as ImageIcon,
  Download,
  Trash2,
  Plus,
  AlertTriangle,
  Key,
  Loader2
} from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import PasswordChangeModal from "@/components/PasswordChangeModal"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
  subscriptionType: string
  credits: number
  totalCreditsUsed: number
  needsPasswordChange: boolean
}

type StylePreset = {
  id: string
  name: string
  description: string
  prompt: string
  previewUrl: string | null
  category: string
}

type Conversion = {
  id: string
  originalUrl: string
  convertedUrl: string | null
  status: string
  createdAt: Date
  stylePreset: StylePreset
  creditsUsed: number
}

export default function DashboardClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([])
  const [recentConversions, setRecentConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user?.email) {
      loadDashboardData()
    }
  }, [status, session, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // For now, create a mock user since we can't access the database during build
      const mockUser: User = {
        id: "1",
        name: session?.user?.name || null,
        email: session?.user?.email || "",
        image: session?.user?.image || null,
        subscriptionType: "FREE_TRIAL",
        credits: 3,
        totalCreditsUsed: 0,
        needsPasswordChange: false
      }

      // Mock style presets
      const mockStylePresets: StylePreset[] = [
        {
          id: "1",
          name: "Oil Painting",
          description: "Transform your photo into a classic oil painting",
          prompt: "oil painting style",
          previewUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
          category: "Artistic"
        },
        {
          id: "2",
          name: "Anime Style",
          description: "Turn your photo into anime artwork",
          prompt: "anime style",
          previewUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          category: "Animation"
        }
      ]

      setUser(mockUser)
      setStylePresets(mockStylePresets)
      setRecentConversions([])

    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file")
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  })

  const handleConvert = async () => {
    if (!user) {
      toast.error("Please sign in to continue")
      return
    }

    if (!selectedFile || !selectedStyle) {
      toast.error("Please select a photo and style")
      return
    }

    if (user.credits < 1) {
      toast.error("You don't have enough credits. Please purchase more credits to continue.")
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('styleId', selectedStyle.id)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const result = await response.json()
      toast.success("Photo conversion started! Check your history for updates.")

      // Reset form
      setSelectedFile(null)
      setPreviewUrl(null)
      setSelectedStyle(null)

      // Refresh the page to show updated credits
      window.location.reload()

    } catch (error) {
      console.error('Conversion error:', error)
      toast.error("Conversion failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getSubscriptionBadge = () => {
    if (!user) return <Badge variant="secondary">Loading...</Badge>

    switch (user.subscriptionType) {
      case 'STARTER':
        return <Badge className="bg-purple-600"><Crown className="h-3 w-3 mr-1" />Starter</Badge>
      case 'STANDARD':
        return <Badge className="bg-orange-600"><Crown className="h-3 w-3 mr-1" />Standard</Badge>
      case 'PRO':
        return <Badge className="bg-yellow-600"><Crown className="h-3 w-3 mr-1" />Pro</Badge>
      default:
        return <Badge variant="secondary">Free Trial</Badge>
    }
  }

  const categorizedStyles = stylePresets.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = []
    }
    acc[style.category].push(style)
    return acc
  }, {} as Record<string, StylePreset[]>)

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Palette className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Artesia
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {getSubscriptionBadge()}

            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{user.credits} credits</span>
              {user.credits < 5 && (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">
                    <Plus className="h-3 w-3 mr-1" />
                    Buy More
                  </Link>
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/pricing">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Upgrade Plan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div>
                    <PasswordChangeModal
                      trigger={
                        <div className="flex items-center w-full cursor-pointer">
                          <Key className="mr-2 h-4 w-4" />
                          <span>Change Password</span>
                        </div>
                      }
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Password Change Alert */}
        {user.needsPasswordChange && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
              <div className="flex-1">
                <h3 className="text-orange-800 font-semibold">Security Notice</h3>
                <p className="text-orange-700 text-sm">
                  For your security, please change your auto-generated password.
                </p>
              </div>
              <PasswordChangeModal
                needsPasswordChange={true}
                trigger={
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                }
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Photo
                </CardTitle>
                <CardDescription>
                  Upload an image to transform with AI. Supported formats: JPG, PNG, GIF, WebP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-md mx-auto">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFile(null)
                            setPreviewUrl(null)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? "Drop your image here" : "Drag & drop an image here"}
                        </p>
                        <p className="text-gray-500">or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Choose Art Style
                </CardTitle>
                <CardDescription>
                  Select from our collection of AI art styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(categorizedStyles).map(([category, styles]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {styles.map((style) => (
                        <div
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                            selectedStyle?.id === style.id
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="aspect-square relative">
                            {style.previewUrl && (
                              <Image
                                src={style.previewUrl}
                                alt={style.name}
                                fill
                                className="object-cover rounded-t-lg"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm">{style.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {style.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Convert Button */}
            <div className="flex justify-center">
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleConvert}
                  disabled={!selectedFile || !selectedStyle || isProcessing || user.credits < 1}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg mb-3"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Transform Photo (1 credit)
                    </>
                  )}
                </Button>
                {user.credits < 1 && (
                  <p className="text-sm text-red-600">
                    Not enough credits. <Link href="/pricing" className="underline">Purchase more credits</Link>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Conversions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Recent Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentConversions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No conversions yet. Upload your first photo!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentConversions.map((conversion) => (
                      <div key={conversion.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="relative w-12 h-12">
                          <Image
                            src={conversion.originalUrl}
                            alt="Original"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conversion.stylePreset.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(conversion.createdAt).toLocaleDateString()} • {conversion.creditsUsed} credit{conversion.creditsUsed !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge
                          variant={conversion.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {conversion.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Info */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Available Credits:</span>
                    <span className="font-bold text-lg text-purple-800">{user.credits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Total Used:</span>
                    <span className="text-purple-600">{user.totalCreditsUsed}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                    <Link href="/pricing">
                      <Plus className="mr-2 h-4 w-4" />
                      Buy More Credits
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
