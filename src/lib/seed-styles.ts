import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface StylePresetData {
  name: string
  description: string
  prompt: string
  category: string
  previewUrl: string
}

export async function addStylePresets(styles: StylePresetData[]) {
  console.log(`Adding ${styles.length} style presets...`)

  const results = []

  for (const style of styles) {
    try {
      const stylePreset = await prisma.stylePreset.create({
        data: {
          name: style.name,
          description: style.description,
          prompt: style.prompt,
          category: style.category,
          previewUrl: style.previewUrl,
          isActive: true
        }
      })
      console.log(`✓ Added style: ${stylePreset.name}`)
      results.push(stylePreset)
    } catch (error) {
      console.error(`✗ Failed to add style: ${style.name}`, error)
    }
  }

  console.log(`Successfully added ${results.length}/${styles.length} styles`)
  return results
}

export async function updateStylePreset(id: string, data: Partial<StylePresetData>) {
  return await prisma.stylePreset.update({
    where: { id },
    data
  })
}

export async function deleteStylePreset(id: string) {
  return await prisma.stylePreset.delete({
    where: { id }
  })
}

export async function getAllStyles() {
  return await prisma.stylePreset.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  })
}

export async function getStylesByCategory(category: string) {
  return await prisma.stylePreset.findMany({
    where: {
      category,
      isActive: true
    },
    orderBy: { name: 'asc' }
  })
}
