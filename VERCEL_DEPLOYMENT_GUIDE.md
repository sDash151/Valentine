# Vercel Deployment Guide 🚀

Complete guide to deploy your Valentine Week Surprise website to Vercel.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- [x] Pushed your code to GitHub
- [x] Supabase project set up and running
- [x] Cloudinary account configured
- [x] All environment variables ready

## 🔧 Step 1: Configure Root Directory

**IMPORTANT**: Your Next.js app is in the `valentine-week` folder, not the root.

In Vercel deployment settings:
1. Click **"Edit"** next to Root Directory
2. Change from `./` to `valentine-week`
3. This tells Vercel where your Next.js app is located

## 🌍 Step 2: Set Environment Variables

Click **"Environment Variables"** and add ALL of these:

### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://ljhmwynppwqoizcjrvkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaG13eW5wcHdxb2l6Y2pydmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDI3MTcsImV4cCI6MjA4NjExODcxN30.yZyl5DjUdtLdQGURdE93z-iALe-MsVzJcbrGdkxZPLU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaG13eW5wcHdxb2l6Y2pydmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU0MjcxNywiZXhwIjoyMDg2MTE4NzE3fQ.Rb4RjQ_UKJJ6YDWWmQyxkb8QRkAW2L4Q7WtqrSbfF0g
```

### Cloudinary Variables
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dcg1ndjto
CLOUDINARY_API_KEY=735257194238226
CLOUDINARY_API_SECRET=4gKepO97ZbhGTmrWB3CvE7HV84o
```

### Authentication Variables
```
JWT_SECRET=valentine_week_secret_key_2024
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### User Credentials
```
ADMIN_EMAIL=souravdilu78090@gmail.com
ADMIN_PASSWORD=Sourav@78090
USER_NICKNAME=pavithra
USER_PASSWORD=bubu13032026
```

**Note**: After deployment, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL.

## 🎯 Step 3: Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## 🚀 Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://valentine.vercel.app`

## ✅ Step 5: Post-Deployment Configuration

### Update Environment Variable
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update it to your actual Vercel URL: `https://your-app-name.vercel.app`
4. Redeploy (Deployments → Click "..." → Redeploy)

### Configure Supabase CORS (if needed)
If you get CORS errors:
1. Go to Supabase Dashboard → Settings → API
2. Add your Vercel URL to allowed origins

### Test Your Deployment
1. Visit your Vercel URL
2. Test admin login: `/admin`
3. Test user entrance: `/entrance`
4. Create a test surprise
5. Upload a test photo/video

## 🔒 Security Recommendations

### For Production (Optional but Recommended):

1. **Rotate Cloudinary Keys**:
   - Go to Cloudinary Dashboard → Settings → Security
   - Generate new API keys
   - Update in Vercel environment variables

2. **Change Passwords**:
   - Update `ADMIN_PASSWORD` and `USER_PASSWORD`
   - Use strong, unique passwords

3. **Generate New JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Update `JWT_SECRET` in Vercel

4. **Enable Vercel Password Protection** (optional):
   - Settings → Deployment Protection
   - Add password to protect your site before Valentine's Day

## 🐛 Troubleshooting

### Build Fails
- Check Root Directory is set to `valentine-week`
- Verify all environment variables are set
- Check build logs for specific errors

### Database Connection Fails
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify RLS policies are set up

### Upload Fails
- Verify Cloudinary credentials
- Check Cloudinary upload preset settings
- Verify file size limits

### 404 Errors
- Ensure Root Directory is `valentine-week`
- Check that all pages are in `app/` directory
- Verify Next.js 15 app router structure

## 📱 Custom Domain (Optional)

To use your own domain:
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `valentine.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## 🎉 You're Live!

Your Valentine Week Surprise website is now deployed and accessible worldwide!

Share the link with Pavithra on Valentine's Day: `https://your-app-name.vercel.app/entrance`

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Check deployment logs in Vercel Dashboard
