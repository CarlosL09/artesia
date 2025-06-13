# 🚀 Quick Deploy Guide for Artesia

## **Step 1: Push to GitHub**

1. Go to [GitHub.com](https://github.com) and create a new repository called `artesia`
2. Copy the commands GitHub gives you to push your existing code:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/artesia.git
git push -u origin main
```

## **Step 2: Set Up Database**

### Option A: Supabase (Recommended - Free tier)
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (it looks like `postgresql://...`)

### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Copy the connection string

## **Step 3: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Import Project"
4. Select your `artesia` repository
5. **IMPORTANT**: Before deploying, click "Environment Variables" and add these:

### Required Environment Variables:
```
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-vercel-app.vercel.app
DATABASE_URL=your-database-connection-string-from-step-2
OPENAI_API_KEY=sk-your-openai-api-key
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Optional (add later):
```
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PAYPAL_ENVIRONMENT=sandbox
```

6. Click "Deploy"

## **Step 4: Get Your API Keys**

### OpenAI API Key:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login
3. Go to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

### Stripe API Keys:
1. Go to [stripe.com](https://stripe.com)
2. Sign up/login
3. Go to Developers → API Keys
4. Copy "Publishable key" (starts with `pk_test_`)
5. Copy "Secret key" (starts with `sk_test_`)

### NEXTAUTH_SECRET:
Generate a random string at [generate-secret.vercel.app](https://generate-secret.vercel.app)

## **Step 5: Set Up Database Tables**

After deployment, run these commands in Vercel's terminal or locally:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## **Step 6: Configure Stripe Webhooks**

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-vercel-app.vercel.app/api/stripe/webhook`
4. Events: Select `checkout.session.completed`
5. Copy the webhook secret (starts with `whsec_`)
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## **🎉 You're Live!**

Your Artesia app will be available at: `https://your-vercel-app.vercel.app`

### Test it:
1. Visit your site
2. Sign up with an email
3. The payment flow will work with Stripe test mode
4. Check that photo upload works (you'll see the AI placeholder for now)

### Next Steps:
1. Add a custom domain in Vercel settings
2. Set up real email service for password delivery
3. Add the remaining 42 style presets
4. Switch Stripe to live mode when ready

**Need help?** The deployment usually takes 5-10 minutes total! 🚀
