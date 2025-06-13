import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const stylePresets = [
  {
    name: "Oil Painting",
    description: "Transform your photo into a classic oil painting with rich textures and vibrant colors",
    prompt: "Transform this image into a beautiful oil painting style with rich textures, vibrant colors, and visible brush strokes. Maintain the composition and subjects while giving it an artistic, painted appearance with depth and warmth.",
    category: "Artistic",
    previewUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
  },
  {
    name: "Watercolor",
    description: "Create a soft, dreamy watercolor painting effect",
    prompt: "Convert this image into a delicate watercolor painting with soft, flowing colors, gentle gradients, and the characteristic texture of watercolor on paper. Keep the essence of the original while adding artistic fluidity.",
    category: "Artistic",
    previewUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    name: "Anime Style",
    description: "Turn your photo into anime/manga artwork",
    prompt: "Transform this image into anime/manga style artwork with clean lines, vibrant colors, large expressive eyes, and the characteristic aesthetic of Japanese animation. Maintain the subject's features while stylizing them.",
    category: "Animation",
    previewUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    name: "Vintage Film",
    description: "Give your photo a nostalgic vintage film look",
    prompt: "Apply a vintage film aesthetic to this image with warm tones, slight grain, muted colors, and the nostalgic feel of old photographs from the 1970s-80s. Add subtle vignetting and film-like characteristics.",
    category: "Vintage",
    previewUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop"
  },
  {
    name: "Cyberpunk",
    description: "Create a futuristic cyberpunk aesthetic",
    prompt: "Transform this image into a cyberpunk aesthetic with neon colors, futuristic elements, dark atmospheric lighting, and high-tech urban vibes. Add glowing neon highlights and a dystopian future atmosphere.",
    category: "Futuristic",
    previewUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
  },
  {
    name: "Pop Art",
    description: "Create bold pop art with vibrant colors and comic book style",
    prompt: "Convert this image into pop art style with bold, vibrant colors, high contrast, and comic book aesthetics. Use bright, saturated colors and clean, graphic elements reminiscent of Andy Warhol's work.",
    category: "Modern",
    previewUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
  },
  {
    name: "Pencil Sketch",
    description: "Transform into a detailed pencil drawing",
    prompt: "Convert this image into a detailed pencil sketch with realistic shading, cross-hatching, and the texture of graphite on paper. Maintain fine details while giving it the appearance of hand-drawn artwork.",
    category: "Sketch",
    previewUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop"
  },
  {
    name: "Fantasy Art",
    description: "Create magical fantasy artwork",
    prompt: "Transform this image into fantasy art with magical elements, ethereal lighting, mystical atmosphere, and enchanted aesthetics. Add fantasy-like qualities while maintaining the original composition.",
    category: "Fantasy",
    previewUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
  }
]

async function main() {
  console.log('Start seeding...')

  for (const preset of stylePresets) {
    const stylePreset = await prisma.stylePreset.create({
      data: preset,
    })
    console.log(`Created style preset: ${stylePreset.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
