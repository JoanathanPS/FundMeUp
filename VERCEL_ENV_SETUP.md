# Vercel Environment Variables Setup

## ⚠️ Error You're Seeing

```
Environment Variable "VITE_SUPABASE_URL" references Secret "vite_supabase_url", which does not exist.
```

This means Vercel is trying to reference a **Secret** instead of setting the value directly.

## ✅ Fix: Set Environment Variables Directly

### Step 1: Go to Environment Variables Settings

1. In your Vercel project dashboard
2. Click **"Settings"** tab (top right)
3. Click **"Environment Variables"** in the left sidebar

### Step 2: Add Variables (NOT Secrets)

For each variable, click **"Add New"** and fill in:

#### Variable 1: VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co` (your actual Supabase URL)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual anon key)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 3: VITE_DEFAULT_MODE
- **Key**: `VITE_DEFAULT_MODE`
- **Value**: `demo`
- **Environment**: Select all
- Click **"Save"**

#### Variable 4: VITE_API_URL (Optional - set after backend deploy)
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.com` (set this after deploying backend)
- **Environment**: Select all
- Click **"Save"**

## ⚠️ Important: Use "Value" NOT "Secret"

When adding variables:
- ✅ **DO**: Type the actual value in the "Value" field
- ❌ **DON'T**: Click "Link Secret" or reference a secret name

## Where to Find Your Supabase Values

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

## After Adding Variables

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on your latest deployment
3. Click **"Redeploy"**
4. Or trigger a new deployment by pushing to GitHub

## Example Values (Replace with YOUR actual values)

```
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ4MDA5NTEsImV4cCI6MjA4MDM3Njk1MX0.example
VITE_DEFAULT_MODE=demo
VITE_API_URL=https://your-backend.railway.app
```

## Troubleshooting

**"Still showing secret reference error"**
- Delete the variable and recreate it
- Make sure you're typing the value directly, not linking a secret

**"Variables not working after deploy"**
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables
- Check build logs to see if variables are being read

**"Can't find Supabase values"**
- Go to Supabase Dashboard → Your Project → Settings → API
- The Project URL and anon key are shown there

---

**TL;DR**: Add environment variables with actual values (not secret references) in Settings → Environment Variables, then redeploy.

