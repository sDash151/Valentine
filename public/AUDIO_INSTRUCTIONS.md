# Memory Lane Background Music

## Setup Instructions

To add background music to the Memory Lane page:

1. **Find a romantic song** (MP3 format recommended)
   - Suggested: Soft instrumental, romantic melody
   - Keep file size reasonable (< 5MB for faster loading)

2. **Name the file:** `memory-lane-music.mp3`

3. **Place it in this folder:** `valentine-week/public/`

4. **The music will:**
   - Auto-play when the Memory Lane page loads
   - Loop continuously while browsing memories
   - Be hidden (no visible player controls)

## Recommended Songs

Some romantic instrumental suggestions:
- "A Thousand Years" (Instrumental)
- "Perfect" (Instrumental)
- "All of Me" (Instrumental)
- Any soft piano or acoustic guitar melody

## File Location

```
valentine-week/
  public/
    memory-lane-music.mp3  ← Place your audio file here
```

## Current Status

⚠️ **Audio file not found!**

The code is looking for: `/memory-lane-music.mp3`

Please add your audio file to enable background music.

## Alternative: Use Cloudinary

If you prefer to host the audio on Cloudinary:

1. Upload your audio file to Cloudinary
2. Copy the URL
3. Update the audio src in `valentine-week/app/memory-lane/page.tsx`:
   ```tsx
   <audio
     ref={audioRef}
     src="YOUR_CLOUDINARY_URL_HERE"
     loop
     autoPlay
     className="hidden"
   />
   ```

## Browser Autoplay Policy

Modern browsers may block autoplay with sound. The music will:
- Try to autoplay when page loads
- If blocked, will start playing after user interaction (clicking navigation buttons)
- This is normal browser behavior for better user experience
