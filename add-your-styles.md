# Adding Your 50 Style Presets

## Instructions

1. Upload your style preview images to a cloud storage service (like AWS S3, Cloudinary, or similar)
2. Get the public URLs for each image
3. Replace the example data below with your 50 styles
4. Copy the styles array to `scripts/add-styles.ts`
5. Run the script to add them to the database

## Style Template

```typescript
const newStyles: StylePresetData[] = [
  {
    name: "Your Style Name",
    description: "Brief description of what this style does to photos",
    prompt: "Detailed prompt for OpenAI describing exactly how to transform the image in this style. Be very specific about colors, textures, lighting, artistic techniques, etc.",
    category: "Category Name", // e.g., "Artistic", "Vintage", "Modern", "Fantasy", etc.
    previewUrl: "https://your-image-hosting.com/preview1.jpg"
  },
  // Add your 49 other styles here...
]
```

## Example Categories

- **Artistic**: Oil Painting, Watercolor, Acrylic, etc.
- **Photography**: Vintage, Black & White, HDR, etc.
- **Digital**: Cyberpunk, Neon, Glitch, etc.
- **Animation**: Anime, Cartoon, Disney, etc.
- **Classical**: Renaissance, Baroque, Impressionist, etc.
- **Modern**: Pop Art, Minimalist, Abstract, etc.
- **Fantasy**: Magical, Ethereal, Dark Fantasy, etc.
- **Retro**: 80s, 90s, Vintage Film, etc.

## Running the Script

After adding your styles to `scripts/add-styles.ts`:

```bash
cd photo-style-saas
npx tsx scripts/add-styles.ts
```

## Payment Integration Setup

### Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env` file:
```
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### PayPal Setup
1. Create a PayPal Developer account at https://developer.paypal.com
2. Create an application to get your client credentials
3. Add them to your `.env` file:
```
PAYPAL_CLIENT_ID="your_client_id"
PAYPAL_CLIENT_SECRET="your_client_secret"
PAYPAL_ENVIRONMENT="sandbox" # or "live" for production
```

### OpenAI API
1. Get your OpenAI API key from https://platform.openai.com
2. Add it to your `.env` file:
```
OPENAI_API_KEY="sk-..."
```

### Google OAuth (for authentication)
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add them to your `.env` file:
```
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

The platform is ready to handle both Stripe and PayPal payments, and will scale to handle your 50 style presets efficiently!
