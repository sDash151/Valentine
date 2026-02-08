# ✅ Complete Setup Checklist

## 🎯 Follow This Order

### Phase 1: Supabase Setup (15 minutes)

- [ ] **1.1** Go to https://supabase.com
- [ ] **1.2** Sign up with GitHub or Email
- [ ] **1.3** Click "New Project"
- [ ] **1.4** Name it `valentine-week`
- [ ] **1.5** Create database password (SAVE IT!)
- [ ] **1.6** Choose region (closest to you)
- [ ] **1.7** Select "Free" plan
- [ ] **1.8** Click "Create new project"
- [ ] **1.9** Wait 2-3 minutes for setup

### Phase 2: Get Supabase Credentials (5 minutes)

- [ ] **2.1** Click "Settings" (⚙️) in left sidebar
- [ ] **2.2** Click "API"
- [ ] **2.3** Copy "Project URL"
- [ ] **2.4** Copy "anon public" key
- [ ] **2.5** Click "Reveal" and copy "service_role" key

### Phase 3: Add Credentials to Project (2 minutes)

- [ ] **3.1** Open `valentine-week/.env.local` file
- [ ] **3.2** Paste Project URL in `NEXT_PUBLIC_SUPABASE_URL`
- [ ] **3.3** Paste anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **3.4** Paste service_role key in `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **3.5** Save the file

### Phase 4: Create Database Tables (5 minutes)

- [ ] **4.1** In Supabase, click "SQL Editor" in left sidebar
- [ ] **4.2** Click "New query"
- [ ] **4.3** Open `valentine-week/lib/db/schema.sql`
- [ ] **4.4** Copy ALL content (Ctrl+A, Ctrl+C)
- [ ] **4.5** Paste into Supabase SQL Editor
- [ ] **4.6** Click "Run" button
- [ ] **4.7** Wait for "Success. No rows returned" message

### Phase 5: Verify Setup (2 minutes)

- [ ] **5.1** Click "Table Editor" in Supabase sidebar
- [ ] **5.2** Verify you see 7 tables:
  - [ ] users
  - [ ] access_tokens
  - [ ] surprises
  - [ ] user_progress
  - [ ] easter_eggs
  - [ ] discovered_easter_eggs
  - [ ] memories

### Phase 6: Test Connection (2 minutes)

- [ ] **6.1** Stop dev server (Ctrl+C in terminal)
- [ ] **6.2** Run `npm run dev`
- [ ] **6.3** Open http://localhost:3000
- [ ] **6.4** Check for no errors in terminal
- [ ] **6.5** Site loads successfully ✅

---

## 🎨 Cloudinary Setup (Already Done!)

- [x] **7.1** Cloudinary credentials added to `.env.local`
- [x] **7.2** No preset needed (using signed uploads)
- [x] **7.3** Upload API endpoint created
- [x] **7.4** Ready to upload files!

---

## 🎉 Start Using Admin Panel

- [ ] **8.1** Go to http://localhost:3000/admin
- [ ] **8.2** Click "Add New Surprise"
- [ ] **8.3** Fill in the form
- [ ] **8.4** Upload a test photo
- [ ] **8.5** Click "Create Surprise"
- [ ] **8.6** Check if it appears in the list
- [ ] **8.7** Go to http://localhost:3000/home
- [ ] **8.8** See your surprise in the grid!

---

## 📝 Add Your Content

### Surprises (7 total)
- [ ] Day 1: Love Letter
- [ ] Day 2: Photo
- [ ] Day 3: Voice Note
- [ ] Day 4: Quiz
- [ ] Day 5: Playlist
- [ ] Day 6: Video
- [ ] Day 7: Grand Finale (Mixed)

### Memory Lane (5-10 photos)
- [ ] Memory 1
- [ ] Memory 2
- [ ] Memory 3
- [ ] Memory 4
- [ ] Memory 5

### Settings
- [ ] Set her nickname
- [ ] Set your signature
- [ ] Set site password

---

## 🧪 Final Testing

- [ ] Test on desktop browser
- [ ] Test on mobile phone
- [ ] Test entrance animation
- [ ] Test surprise unlock
- [ ] Test Memory Lane scroll
- [ ] Test stats page
- [ ] Test all animations
- [ ] Check countdown timer
- [ ] Verify all photos load
- [ ] Test audio/video playback

---

## 🚀 Deployment (Optional)

- [ ] Create Vercel account
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy to production
- [ ] Test live site
- [ ] Share link with her!

---

## 📊 Progress Tracker

**Supabase Setup**: ⬜⬜⬜⬜⬜⬜ 0/6 phases
**Content Added**: ⬜⬜⬜⬜⬜⬜⬜ 0/7 surprises
**Testing**: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0/10 tests

---

## ⏱️ Estimated Time

- **Supabase Setup**: 30 minutes
- **Adding Content**: 2-3 hours (depends on how much you write/record)
- **Testing**: 30 minutes
- **Total**: 3-4 hours

---

## 💡 Quick Tips

1. **Do Supabase first** - Everything else depends on it
2. **Test after each phase** - Catch issues early
3. **Save your credentials** - Keep them somewhere safe
4. **Take your time with content** - Quality over speed
5. **Test on mobile** - She'll probably open it on her phone

---

## 🆘 If Something Goes Wrong

### Supabase Issues:
→ Check SUPABASE_SETUP.md (detailed troubleshooting)

### Upload Issues:
→ Check CLOUDINARY_SETUP.md

### General Issues:
→ Check QUICK_START.md or ADMIN_GUIDE.md

---

## 🎯 Current Status

Update this as you complete each phase:

```
✅ = Done
⏳ = In Progress
⬜ = Not Started

Phase 1: Supabase Account     [  ]
Phase 2: Get Credentials       [  ]
Phase 3: Add to .env.local     [  ]
Phase 4: Create Tables         [  ]
Phase 5: Verify Tables         [  ]
Phase 6: Test Connection       [  ]
Phase 7: Add First Surprise    [  ]
Phase 8: Add All Content       [  ]
Phase 9: Final Testing         [  ]
Phase 10: Ready to Share!      [  ]
```

---

## 🎉 When You're Done

You'll have:
- ✅ Working database
- ✅ File uploads working
- ✅ All 7 surprises added
- ✅ Memory Lane filled
- ✅ Beautiful animations
- ✅ Mobile responsive
- ✅ Ready to share!

**Then just send her the link and watch the magic happen! 💝**

---

**Start with Phase 1 and work your way down. You got this! 🚀**
