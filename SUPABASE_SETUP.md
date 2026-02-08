# 🗄️ Supabase Setup - Complete Step-by-Step Guide

## 📋 What is Supabase?

Supabase is your database where all the surprises, memories, and settings will be stored. Think of it as the brain of your Valentine Week website.

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Supabase Account**

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - GitHub (recommended - fastest)
   - OR Email/Password
4. Verify your email if needed

---

### **Step 2: Create a New Project**

1. After logging in, click **"New Project"**
2. Fill in the details:
   - **Name**: `valentine-week` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Singapore)` for India)
   - **Pricing Plan**: Select **"Free"** (perfect for this project)
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete ⏳

---

### **Step 3: Get Your API Credentials**

Once your project is ready:

1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"** in the settings menu
3. You'll see:

   **Project URL**:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **anon public key** (under "Project API keys"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```
   
   **service_role key** (under "Project API keys" - click "Reveal"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

4. **Copy these three values** - you'll need them!

---

### **Step 4: Add Credentials to Your Project**

1. Open your project folder: `valentine-week`
2. Open the file: `.env.local`
3. Replace the Supabase section with your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Save the file**

---

### **Step 5: Create Database Tables**

Now we need to create the tables where your data will be stored.

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. **Copy the entire SQL script** from your project:
   - Open file: `valentine-week/lib/db/schema.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)
4. **Paste it** into the SQL Editor in Supabase
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: ✅ **"Success. No rows returned"**

---

### **Step 6: Verify Tables Were Created**

1. In the left sidebar, click **"Table Editor"**
2. You should see these tables:
   - ✅ `users`
   - ✅ `access_tokens`
   - ✅ `surprises`
   - ✅ `user_progress`
   - ✅ `easter_eggs`
   - ✅ `discovered_easter_eggs`
   - ✅ `memories`

If you see all 7 tables, **you're done!** 🎉

---

### **Step 7: Test the Connection**

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C in terminal)
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. If everything loads without errors, **Supabase is connected!** ✅

---

## 🎯 Quick Reference

### Your Supabase Dashboard URLs:

- **Main Dashboard**: https://supabase.com/dashboard/projects
- **Your Project**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- **Table Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
- **SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

---

## 📊 What Each Table Does

### `users`
Stores admin and user accounts (you and her)

### `surprises`
Stores all 7 Valentine Week surprises with:
- Title, unlock date, content type
- Text content, media URLs
- Locked hints

### `memories`
Stores Memory Lane photos with:
- Photos, captions, dates
- Rotation angles, positions

### `user_progress`
Tracks which surprises she has viewed

### `easter_eggs`
Stores hidden surprises to discover

### `discovered_easter_eggs`
Tracks which easter eggs she found

### `access_tokens`
Manages login sessions

---

## 🔒 Security Features

Your database is protected with:
- ✅ **Row Level Security (RLS)** - Users can only see their own data
- ✅ **API Keys** - Only your app can access the database
- ✅ **Encrypted connections** - All data is encrypted in transit

---

## 🧪 Test Your Setup

### Test 1: Check Connection
```bash
# In your project folder
npm run dev
```
If no errors appear, connection is working! ✅

### Test 2: View Tables
1. Go to Supabase → Table Editor
2. Click on `surprises` table
3. You should see an empty table (ready for data!)

### Test 3: Add Test Data (Optional)
1. In Supabase, go to Table Editor
2. Click `surprises` table
3. Click **"Insert row"**
4. Fill in:
   - title: "Test Surprise"
   - unlock_date: Today's date
   - content_type: "letter"
   - content_payload: `{"text": "Test message"}`
   - locked_hint: "Test hint"
   - order_index: 1
5. Click **"Save"**
6. Go to http://localhost:3000/home
7. You should see your test surprise!

---

## 🎨 Visual Guide

### Finding Your API Keys:

```
Supabase Dashboard
└── Settings (⚙️ at bottom left)
    └── API
        ├── Project URL ← Copy this
        ├── anon public key ← Copy this
        └── service_role key ← Click "Reveal" then copy
```

### Running the SQL Script:

```
Supabase Dashboard
└── SQL Editor (📝 in left sidebar)
    └── New query
        └── Paste schema.sql content
            └── Click "Run" ▶️
```

---

## ❓ Troubleshooting

### Problem: "Failed to connect to Supabase"

**Solution**:
1. Check `.env.local` has correct URL and keys
2. Make sure there are no extra spaces
3. Restart the dev server
4. Check Supabase project is active (not paused)

### Problem: "Table does not exist"

**Solution**:
1. Go to Supabase → SQL Editor
2. Run the schema.sql script again
3. Check Table Editor to verify tables exist

### Problem: "Invalid API key"

**Solution**:
1. Go to Supabase → Settings → API
2. Copy the keys again (they might have changed)
3. Update `.env.local`
4. Restart server

### Problem: "Row Level Security policy violation"

**Solution**:
1. The SQL script includes RLS policies
2. Make sure you ran the ENTIRE schema.sql file
3. Check in Supabase → Authentication → Policies

---

## 📱 Free Tier Limits

Supabase Free tier includes:
- ✅ **500 MB database** (more than enough!)
- ✅ **1 GB file storage** (for future use)
- ✅ **2 GB bandwidth** (plenty for this project)
- ✅ **50,000 monthly active users** (you only need 1!)
- ✅ **Unlimited API requests**

Perfect for your Valentine Week website! 🎉

---

## 🎯 Next Steps After Setup

Once Supabase is configured:

1. ✅ **Add surprises** via admin panel
2. ✅ **Upload photos** to Cloudinary
3. ✅ **Test the unlock system**
4. ✅ **Add memories** to Memory Lane
5. ✅ **Customize settings**

---

## 💡 Pro Tips

1. **Bookmark your project**: Save the Supabase dashboard URL
2. **Save your password**: Store the database password securely
3. **Backup your keys**: Keep a copy of API keys somewhere safe
4. **Check Table Editor**: Use it to view/edit data directly
5. **Use SQL Editor**: For running queries and testing

---

## 🎉 You're Done!

Once you complete these steps:
- ✅ Database is created
- ✅ Tables are set up
- ✅ Connection is working
- ✅ Ready to add content!

Go to your admin panel and start adding surprises:
```
http://localhost:3000/admin
```

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Check your project**: All data visible in Table Editor

---

**Happy building! Your Valentine Week website is almost ready! 💝**
