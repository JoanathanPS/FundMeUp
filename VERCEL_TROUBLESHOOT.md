# Vercel Troubleshooting Guide

## ✅ Your Environment Variables Look Good!

I can see you have:
- ✅ `VITE_SUPABASE_URL` 
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_DEFAULT_MODE`

## Common Issues & Fixes

### Issue 1: Root Directory Not Set ⚠️ MOST COMMON

**Check:**
1. Go to **Settings → General**
2. Look for **"Root Directory"**
3. Is it set to `frontend`?

**If NOT set:**
1. Click **"Edit"** next to Root Directory
2. Type: `frontend`
3. Click **"Save"**
4. Go to **Deployments** → Click **"Redeploy"**

### Issue 2: Need to Redeploy After Adding Env Vars

**Fix:**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait for build to complete

### Issue 3: Build Error - Check Build Logs

**Check:**
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Click **"Build Logs"** tab
4. Look for error messages

**Common Build Errors:**
- `package.json not found` → Root Directory not set to `frontend`
- `Cannot find module` → Missing dependencies
- `Environment variable undefined` → Env vars not set correctly

### Issue 4: Environment Variables Not Available During Build

**Check:**
1. In **Environment Variables** settings
2. Make sure each variable has **"All Environments"** selected (Production, Preview, Development)
3. If you only selected "Production", add it to Preview and Development too

### Issue 5: Wrong Framework Detection

**Check:**
1. Go to **Settings → General**
2. Check **"Framework Preset"**
3. Should be: `Vite` or `Other`
4. If wrong, change it and redeploy

## Step-by-Step Fix Checklist

Run through these in order:

- [ ] **Root Directory** is set to `frontend` in Settings → General
- [ ] **Environment Variables** are set with actual values (not secret references)
- [ ] All env vars have **"All Environments"** selected
- [ ] **Redeployed** after setting Root Directory and env vars
- [ ] Checked **Build Logs** for specific error messages
- [ ] **Framework** is detected as Vite

## What Error Are You Seeing?

Please check and tell me:

1. **What's the exact error message?**
   - Is it in the build logs?
   - Is it on the deployment page?
   - Is it when you visit the site?

2. **What does the deployment status show?**
   - ✅ Ready
   - ⚠️ Building
   - ❌ Error
   - ⏸️ Canceled

3. **Check Build Logs:**
   - Go to Deployments → Click failed deployment → Build Logs
   - Copy the last 20-30 lines of error output

## Quick Test

After fixing Root Directory and redeploying:

1. Wait for deployment to finish
2. Click **"Visit"** button on your deployment
3. Open browser console (F12)
4. Check for errors

If you see `VITE_SUPABASE_URL is undefined` in console:
- Env vars not being read → Check Root Directory and redeploy

If you see build errors:
- Check Build Logs for specific error

---

**Next Step**: Check Root Directory first, then redeploy. That fixes 90% of issues!

