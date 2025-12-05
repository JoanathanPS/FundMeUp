# Vercel Root Directory Setup

## ⚠️ CRITICAL: Set Root Directory to `frontend`

When deploying to Vercel, you **MUST** set the Root Directory to `frontend` or the build will fail.

## Step-by-Step Instructions

### Method 1: During Initial Import

1. Go to https://vercel.com/new
2. Import `JoanathanPS/FundMeUp`
3. On the **"Configure Project"** page:
   - Scroll down to **"Root Directory"**
   - Click **"Edit"**
   - Type: `frontend`
   - Click **"Continue"**
4. Add environment variables
5. Click **"Deploy"**

### Method 2: After Import (If You Forgot)

1. Go to your Vercel project dashboard
2. Click **"Settings"** tab (top right)
3. Go to **"General"** section
4. Find **"Root Directory"**
5. Click **"Edit"**
6. Enter: `frontend`
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"Redeploy"** → **"Redeploy"** (latest)

## Visual Guide

```
Vercel Project Settings:
├── General
│   ├── Project Name: FundMeUp
│   ├── Framework: Vite
│   └── Root Directory: frontend  ← SET THIS!
│
└── Build & Development Settings
    ├── Build Command: npm run build
    ├── Output Directory: dist
    └── Install Command: npm install
```

## Why Root Directory Matters

Without setting Root Directory to `frontend`:
- ❌ Vercel looks for `package.json` in root (doesn't exist)
- ❌ Build fails with "package.json not found"
- ❌ Frontend code not accessible

With Root Directory set to `frontend`:
- ✅ Vercel finds `frontend/package.json`
- ✅ Build succeeds
- ✅ Frontend deploys correctly

## Quick Link

**Direct Vercel Import**: https://vercel.com/new?import=JoanathanPS/FundMeUp

After clicking, make sure to set Root Directory to `frontend` before deploying!

