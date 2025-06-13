import { addStylePresets, StylePresetData } from '../src/lib/seed-styles'

// Example format for adding new styles
const newStyles: StylePresetData[] = [
  // Add your 50 styles here in this format:
  // {
  //   name: "Style Name",
  //   description: "Brief description of the style effect",
  //   prompt: "Detailed prompt for OpenAI describing the transformation",
  //   category: "Category Name",
  //   previewUrl: "https://your-image-url.com/preview.jpg"
  // },
]

async function main() {
  if (newStyles.length === 0) {
    console.log('No styles to add. Please add styles to the newStyles array.')
    return
  }

  try {
    await addStylePresets(newStyles)
    console.log('✓ All styles added successfully!')
  } catch (error) {
    console.error('Error adding styles:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
