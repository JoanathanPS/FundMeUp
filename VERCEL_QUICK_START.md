# Vercel Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Import to Vercel
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"GitHub"** and authorize
4. Find and select: **`JoanathanPS/FundMeUp`**
5. Click **"Import"**

### Step 2: Configure Root Directory ⚠️ CRITICAL
1. On the **"Configure Project"** page, scroll down
2. Find **"Root Directory"** section
3. Click **"Edit"** button
4. Select **`frontend`** folder
5. Click **"Continue"**

### Step 3: Add Environment Variables
Before deploying, click **"Environment Variables"** and add:

```
VITE_SUPABASE_URL = your-supabase-url
VITE_SUPABASE_ANON_KEY = your-supabase-anon-key  
VITE_DEFAULT_MODE = demo
VITE_API_URL = https://your-backend-url.com
```

**Note**: You can add `VITE_API_URL` later after deploying backend.

### Step 4: Deploy!
Click **"Deploy"** and wait 2-3 minutes.

### Step 5: Get Your URL
After deployment, Vercel will give you a URL like:
```
https://fundmeup-xyz.vercel.app
```

## 📋 Vercel Settings Summary

| Setting | Value |
|---------|-------|
| Framework | Vite |
| **Root Directory** | **`frontend`** ⚠️ |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## 🔗 Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **New Project**: https://vercel.com/new
- **Your Repo**: https://github.com/JoanathanPS/FundMeUp

## ⚠️ Common Issues

**"Root Directory not found"**
- Make sure you selected `frontend` (not `frontend/`)
- Check that `frontend/package.json` exists

**"Build failed"**
- Check Root Directory is set to `frontend`
- Verify environment variables are set
- Check build logs in Vercel dashboard

**"Frontend folder shows as link in GitHub"**
- This was a submodule issue - should be fixed now
- If still seeing it, refresh GitHub page

## 🎯 After Deployment

1. Test your app at the Vercel URL
2. Deploy backend to Railway/Render
3. Update `VITE_API_URL` in Vercel
4. Redeploy frontend

Done! 🎉

