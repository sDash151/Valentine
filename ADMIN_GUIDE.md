# 🎨 Admin Panel Guide

## 🚀 Quick Access

**Admin Panel URL**: http://localhost:3000/admin

## 📋 What You Can Do

### 1. **Manage Surprises** 🎁

Create and edit all 7 Valentine Week surprises with different content types:

#### Content Types Available:

- **💌 Love Letter**: Write heartfelt messages with typewriter effect
- **📸 Photo**: Upload photos with captions (Polaroid style)
- **🎥 Video**: Upload video messages
- **🎤 Voice Note**: Upload audio recordings of your voice
- **❓ Quiz**: Create fun quizzes about your relationship
- **🎵 Playlist**: Embed Spotify/YouTube playlists
- **🎁 Mixed Content**: Combine multiple types in one surprise

#### How to Add a Surprise:

1. Go to http://localhost:3000/admin
2. Click "**+ Add New Surprise**"
3. Fill in:
   - **Title**: e.g., "Day 1: A Letter"
   - **Unlock Date**: When it should unlock
   - **Unlock Time**: Specific time (e.g., 00:00 for midnight)
   - **Content Type**: Choose from dropdown
   - **Locked Hint**: Teaser text shown before unlock
4. Add content based on type:
   - **Letter**: Write your message + signature
   - **Photo**: Upload images + add caption
   - **Video**: Upload video file
   - **Voice Note**: Upload audio file
   - **Quiz**: Add question, answer, and hint
   - **Playlist**: Paste Spotify/YouTube URL
5. Click "**Create Surprise**"

### 2. **Manage Memory Lane** 📸

Add photos and captions for the scrapbook page:

#### How to Add a Memory:

1. Go to Admin Panel → **Memory Lane** tab
2. Click "**+ Add New Memory**"
3. Upload a photo
4. Fill in:
   - **Date/Time Period**: e.g., "January 2023"
   - **Caption**: Personal message about this memory
   - **Rotation**: Adjust for scrapbook effect (-5° to 5°)
   - **Position**: Left, Center, or Right
5. Preview how it looks
6. Click "**Add Memory**"

### 3. **Settings** ⚙️

Personalize the experience:

- **Her Nickname**: Used throughout the site
- **Your Name/Signature**: How you sign messages
- **Site Password**: Password she'll use to access

## 📝 Content Tips

### For Love Letters:
```
Write naturally, like you're texting her.

Use double line breaks for paragraphs.

Be specific - mention real moments.

Inside jokes > generic romance.
```

### For Photo Captions:
- Keep them short and sweet
- Reference the specific moment
- Use "you" and "we" language
- Add emojis if that's your style

### For Voice Notes:
- Record in a quiet place
- Speak naturally, like you're calling her
- 30-60 seconds is perfect
- Say her name

### For Quizzes:
- Make them about your relationship
- Not too hard, not too easy
- Reward with a sweet message or photo

## 🎯 Recommended Schedule

### Day 1 (Feb 8): Letter
Start with words. Set the tone.

### Day 2 (Feb 9): Photo
A meaningful photo with a caption.

### Day 3 (Feb 10): Voice Note
Let her hear your voice.

### Day 4 (Feb 11): Quiz
Make it fun and interactive.

### Day 5 (Feb 12): Playlist
Songs that remind you of her.

### Day 6 (Feb 13): Memory Lane
She discovers the scrapbook.

### Day 7 (Feb 14): Video + Mixed
The grand finale - video message + everything.

## 📤 File Upload Guidelines

### Photos:
- **Format**: JPG, PNG
- **Size**: Up to 10MB
- **Recommended**: 1920x1920px or smaller
- **Tip**: Use well-lit, clear photos

### Videos:
- **Format**: MP4, MOV
- **Size**: Up to 100MB
- **Recommended**: 1080p, under 2 minutes
- **Tip**: Record horizontally on phone

### Audio:
- **Format**: MP3, WAV, M4A
- **Size**: Up to 50MB
- **Recommended**: Clear audio, minimal background noise
- **Tip**: Use voice memos app on phone

## 🔄 Current Status

### ✅ What Works Now:
- Full admin interface
- All forms and inputs
- File upload UI
- Preview functionality
- Beautiful design

### 🚧 What Needs Setup:
- **Supabase**: To save data to database
- **Cloudinary**: To store uploaded files
- **Authentication**: To protect admin panel

## 🎨 Customization

### Change Colors:
Edit `valentine-week/app/globals.css`:
```css
--soft-rose: #F7C6CE;
--deep-rose: #E05A6A;
--warm-gold: #FFD08A;
--cream: #FFF8F4;
```

### Change Fonts:
Edit `valentine-week/app/layout.tsx` to use different Google Fonts.

## 💡 Pro Tips

1. **Write everything first**: Draft all messages in a doc before adding
2. **Test on mobile**: Check how it looks on your phone
3. **Use real photos**: Placeholder images don't have the same impact
4. **Be specific**: Generic = forgettable, Specific = memorable
5. **Inside jokes**: These make it truly personal
6. **Voice matters**: Record voice notes - hearing you is powerful
7. **Vary content**: Mix text, photos, audio, video
8. **Build anticipation**: Save the best for last

## 🎯 Making It Personal

### Replace These:
- `[Her Name]` → Her actual nickname
- `[Your person]` → How you sign off
- Mock photos → Real photos from your relationship
- Sample text → Your actual words

### Add These:
- Inside jokes in captions
- Specific dates and moments
- Songs that are "yours"
- Photos only she would understand
- Voice notes saying her name
- References to your conversations

## 📱 Testing Checklist

Before sharing with her:

- [ ] All 7 surprises created
- [ ] Real photos uploaded
- [ ] Voice notes recorded
- [ ] Unlock dates set correctly
- [ ] Her nickname added everywhere
- [ ] Memory Lane filled with photos
- [ ] Test on mobile device
- [ ] Check all animations work
- [ ] Verify countdown timers
- [ ] Test surprise unlocking

## 🚀 Next Steps

1. **Now**: Use admin panel to add content
2. **Next**: Set up Supabase (database)
3. **Then**: Set up Cloudinary (file storage)
4. **Finally**: Deploy to Vercel and share!

## 💝 Remember

The admin panel is just a tool. The magic comes from:
- Your words
- Your voice
- Your photos
- Your memories
- Your specificity

Make it so personal that only she would fully understand it. That's when it becomes powerful.

---

**Need Help?** Check the main README.md for setup instructions.
