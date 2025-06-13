import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"
import sharp from "sharp"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
})

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is properly configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-build") {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase more credits to continue." },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const styleId = formData.get('styleId') as string

    if (!imageFile || !styleId) {
      return NextResponse.json(
        { error: "Image and style are required" },
        { status: 400 }
      )
    }

    // Get style preset
    const stylePreset = await prisma.stylePreset.findUnique({
      where: { id: styleId }
    })

    if (!stylePreset) {
      return NextResponse.json(
        { error: "Style not found" },
        { status: 404 }
      )
    }

    // Convert file to buffer and process with Sharp
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    // Resize and optimize image for OpenAI API
    const processedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Convert to base64 for OpenAI API
    const base64Image = processedImage.toString('base64')
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`

    // Save original image (in a real app, you'd upload to cloud storage)
    const originalUrl = `/uploads/original_${Date.now()}_${imageFile.name}`

    // Create conversion record
    const conversion = await prisma.conversion.create({
      data: {
        userId: user.id,
        stylePresetId: styleId,
        originalUrl,
        status: 'PROCESSING',
        creditsUsed: 1
      }
    })

    // Deduct credits from user immediately
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1
        },
        totalCreditsUsed: {
          increment: 1
        }
      }
    })

    // Process in background (for demo purposes, we'll do it synchronously)
    try {
      // Use OpenAI API to generate the styled image
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${stylePreset.prompt}\n\nPlease transform this image according to the style described above. Return a detailed description of how the image would look when transformed into this artistic style.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })

      const description = response.choices[0]?.message?.content || "Style transformation completed"

      // In a real implementation, you would:
      // 1. Use DALL-E 3 or another image generation API to create the styled image
      // 2. Upload both original and converted images to cloud storage
      // 3. Save the URLs to the database

      // For demo purposes, we'll simulate a successful conversion
      const convertedUrl = `/uploads/converted_${Date.now()}.jpg`

      // Update conversion record
      await prisma.conversion.update({
        where: { id: conversion.id },
        data: {
          convertedUrl,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        conversionId: conversion.id,
        description,
        creditsRemaining: user.credits - 1
      })

    } catch (aiError) {
      console.error('AI processing error:', aiError)

      // Refund credits if AI processing fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            increment: 1
          },
          totalCreditsUsed: {
            decrement: 1
          }
        }
      })

      // Update conversion record with error
      await prisma.conversion.update({
        where: { id: conversion.id },
        data: {
          status: 'FAILED',
          errorMessage: 'AI processing failed',
          creditsUsed: 0 // No credits charged for failed conversion
        }
      })

      return NextResponse.json(
        { error: "AI processing failed. Your credits have been refunded. Please try again." },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
