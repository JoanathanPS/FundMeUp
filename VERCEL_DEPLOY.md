# Vercel Deployment Guide

## Quick Deploy Steps

### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `JoanathanPS/FundMeUp`

### 2. Configure Project Settings

**Important Settings:**
- **Framework Preset**: `Vite` (auto-detected)
- **Root Directory**: `frontend` ⚠️ **CRITICAL**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_DEFAULT_MODE=demo
VITE_API_URL=https://your-backend-url.com
```

**Note**: Replace `your-backend-url.com` with your actual backend URL after deploying backend.

### 4. Deploy Backend Separately

Deploy backend to one of these platforms:

**Railway** (Recommended):
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo, set root directory to `backend`
4. Add environment variables (see backend/env.example.txt)
5. Deploy!

**Render**:
1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### 5. Update Frontend API URL

After backend is deployed:
1. Go back to Vercel → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your backend URL
3. Redeploy frontend (or it will auto-redeploy)

### 6. Update Backend CORS

In your backend, update `ALLOWED_ORIGINS` to include your Vercel domain:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

## Project Structure for Vercel

```
FundMeUp/
├── frontend/          ← Vercel deploys this
│   ├── src/
│   ├── package.json
│   ├── vercel.json   ← Vercel config
│   └── vite.config.ts
└── backend/          ← Deploy separately
```

## Troubleshooting

**Build fails?**
- Check Root Directory is set to `frontend`
- Verify `package.json` exists in `frontend/`
- Check build logs in Vercel dashboard

**API calls fail?**
- Verify `VITE_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is deployed and running

**Environment variables not working?**
- Make sure they start with `VITE_` prefix
- Redeploy after adding new variables
- Check variable names match exactly

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set in both
- [ ] CORS updated in backend
- [ ] Supabase RLS policies configured
- [ ] Test all features in production
- [ ] Update README with production URLs

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check backend logs (Railway/Render)
3. Verify environment variables
4. Test API endpoints directly

