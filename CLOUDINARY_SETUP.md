# ☁️ Cloudinary Setup (No Preset Needed!)

## ✅ You Already Have Your Credentials!

I can see you already have:
- Cloud Name: `dcg1ndjto`
- API Key: `735257194238226`
- API Secret: `4gKepO97ZbhGTmrWB3CvE7HV84o`

## 🚀 Quick Setup

### Step 1: Create `.env.local` file

Copy the example file:
```bash
cp .env.local.example .env.local
```

Your `.env.local` should have:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: That's It!

**No preset needed!** The app uses **signed uploads** which are:
- ✅ More secure
- ✅ No preset configuration required
- ✅ Server-side only (API keys stay private)

## 📤 How It Works

When you upload files in the admin panel:

1. File is selected in browser
2. Sent to `/api/upload` endpoint
3. Server uploads to Cloudinary using your API secret
4. Returns the secure URL
5. URL is saved to database

## 🔒 Security

- API Secret stays on server (never exposed to browser)
- Signed uploads are more secure than unsigned
- Files are organized in `valentine-week` folder

## 📁 Where Files Are Stored

All uploads go to: `valentine-week/` folder in your Cloudinary account

You can view them at:
https://console.cloudinary.com/console/c-dcg1ndjto/media_library/folders/valentine-week

## ✨ Benefits of This Approach

### No Preset Needed:
- ❌ No need to create upload preset in Cloudinary dashboard
- ❌ No need to configure preset settings
- ❌ No need to make preset unsigned

### More Secure:
- ✅ API secret never exposed to browser
- ✅ Server-side validation
- ✅ Better control over uploads

### Simpler:
- ✅ Just add 3 environment variables
- ✅ No additional Cloudinary configuration
- ✅ Works immediately

## 🧪 Test It

1. Make sure `.env.local` has your credentials
2. Restart the dev server: `npm run dev`
3. Go to http://localhost:3000/admin
4. Try uploading a photo
5. It will upload to Cloudinary automatically!

## 🎯 What You Can Upload

- **Photos**: JPG, PNG, GIF, WebP
- **Videos**: MP4, MOV, AVI, WebM
- **Audio**: MP3, WAV, M4A, OGG

All files are automatically optimized by Cloudinary!

## 💡 Pro Tips

1. **Organize by type**: Files are automatically organized in folders
2. **Automatic optimization**: Cloudinary optimizes images/videos automatically
3. **Transformations**: You can add transformations later if needed
4. **CDN delivery**: All files served via Cloudinary's global CDN

## 🔧 Troubleshooting

### If upload fails:

1. **Check credentials**: Make sure `.env.local` has correct values
2. **Restart server**: Stop and run `npm run dev` again
3. **Check console**: Look for error messages in terminal
4. **Verify Cloudinary account**: Make sure account is active

### Common Issues:

**"Upload failed"**
- Check if API credentials are correct
- Make sure `.env.local` file exists
- Restart the dev server

**"No file provided"**
- File might be too large
- Check file format is supported

## 📊 Monitor Uploads

View your uploads in Cloudinary dashboard:
1. Go to https://console.cloudinary.com
2. Click "Media Library"
3. Look for "valentine-week" folder
4. See all uploaded files

## 🎉 Summary

You're all set! No preset configuration needed. Just:

1. ✅ Add credentials to `.env.local`
2. ✅ Restart server
3. ✅ Start uploading!

The app handles everything else automatically with secure, signed uploads.

---

**Need help?** Check the main README.md or ADMIN_GUIDE.md
