# ⚡ 5-Minute Demo Deploy (No Database Required)

Want to see Artesia live immediately? Here's the fastest way:

## **Super Quick Demo Deploy to Vercel**

### **Step 1: Create GitHub Repo (2 minutes)**
1. Go to [github.com](https://github.com) → New Repository
2. Name it `artesia` → Create repository
3. Follow GitHub's "push existing repository" instructions:

```bash
cd photo-style-saas
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/artesia.git
git push -u origin main
```

### **Step 2: Deploy to Vercel (2 minutes)**
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Import Project" → Select your `artesia` repo
3. **Add these minimal environment variables:**

```
NEXTAUTH_SECRET=demo-secret-key-12345
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=file:./demo.db
```

4. Click "Deploy" ✨

### **Step 3: You're Live! (1 minute)**

Visit your app at `https://your-app-name.vercel.app`

**What works immediately:**
- ✅ Beautiful landing page with "One click. Infinite styles."
- ✅ Sign up/login pages (demo mode)
- ✅ Gorgeous dark mode UI
- ✅ Complete responsive design
- ✅ All the beautiful styling and branding

**What needs API keys for full functionality:**
- 🔑 Photo conversion (needs OpenAI API key)
- 💳 Payments (needs Stripe keys)

## **Add Full Functionality Later**

When you're ready for the complete experience, just add these environment variables in Vercel:

```
OPENAI_API_KEY=sk-your-openai-key
STRIPE_PUBLIC_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

**Result**: You'll have a live demo of Artesia in under 5 minutes showing the complete UI and branding! 🎨

Perfect for:
- Showing investors/clients
- Testing the user experience
- Demonstrating the design
- Getting feedback on the concept

Then add the database and API keys when you're ready to go live with payments and AI! 🚀
