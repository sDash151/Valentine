# Password Hint Feature

## Overview
Added a dynamic password hint feature that helps users remember the password without revealing it directly.

## How It Works

### Admin Side
1. Go to **Admin Panel** → **Settings** tab
2. Find the "Access Control" section
3. Set both:
   - **Site Password**: The actual password (e.g., "bubu13032026")
   - **Password Hint**: A sweet hint (e.g., "Our special date 💕")
4. Click "Save Settings"

### User Side (Entrance Page)
1. User clicks "open it" button
2. Password prompt appears
3. User sees "Need a hint? 💭" button below the password field
4. When clicked, a beautiful hint box appears with your custom hint
5. Hint is styled with warm gold background and gentle animation

## Features

✨ **Dynamic**: Hint is fetched from database settings
💭 **Optional**: Only shows if you've set a hint in admin
🎨 **Beautiful**: Matches the romantic theme with animations
🔒 **Helpful**: Guides without revealing the password

## Database Setup

### For New Installations
The `password_hint` field is included in the main schema:
```sql
-- Already in settings-schema.sql
INSERT INTO settings (key, value) VALUES
  ('password_hint', 'Our special date 💕')
ON CONFLICT (key) DO NOTHING;
```

### For Existing Installations
Run this SQL in Supabase SQL Editor:
```sql
INSERT INTO settings (key, value) VALUES
  ('password_hint', 'Our special date 💕')
ON CONFLICT (key) DO NOTHING;
```

Or use the migration file:
```bash
# File: valentine-week/lib/db/add-password-hint.sql
```

## UI Flow

```
Password Prompt
    ↓
User enters wrong password
    ↓
Error message: "Incorrect password. Try again! 💕"
    ↓
User clicks "Need a hint? 💭"
    ↓
Hint box appears with animation
    ↓
Shows: "💡 Our special date 💕"
    ↓
User remembers and enters correct password
    ↓
Success! Redirects to home
```

## Styling

**Hint Button (Hidden State):**
- Small, subtle text
- "Need a hint? 💭"
- Underlined on hover
- Gentle scale animation

**Hint Box (Revealed State):**
- Warm gold background (`bg-warm-gold/10`)
- Gold border (`border-warm-gold/30`)
- Fade-in animation
- Centered text with emoji
- Rounded corners

## Example Hints

Good hints are:
- ✅ "Our special date 💕"
- ✅ "When we first met 🌹"
- ✅ "Your favorite number + my birthday 🎂"
- ✅ "The day you said yes 💍"

Avoid:
- ❌ Too obvious: "The password is..."
- ❌ Too vague: "Think about it"
- ❌ Too long: Multiple sentences

## Files Modified

1. **valentine-week/app/entrance/page.tsx**
   - Added `passwordHint` and `showHint` state
   - Fetches hint from settings API
   - Shows "Need a hint?" button
   - Displays hint box with animation
   - Resets hint when going back

2. **valentine-week/app/admin/page.tsx**
   - Added `password_hint` to settings state
   - Added hint input field in Access Control section
   - Saves hint to database

3. **valentine-week/lib/db/settings-schema.sql**
   - Added default password_hint value

4. **valentine-week/lib/db/add-password-hint.sql**
   - Migration file for existing installations

## Testing

1. **Set the hint:**
   - Go to Admin → Settings
   - Enter a hint like "Our special date 💕"
   - Save settings

2. **Test the flow:**
   - Open entrance page in incognito
   - Click "open it"
   - Enter wrong password
   - Click "Need a hint?"
   - Verify hint appears
   - Enter correct password
   - Verify redirect to home

3. **Test without hint:**
   - Clear the hint in admin
   - Save settings
   - Verify "Need a hint?" button doesn't appear

## Future Enhancements

Possible improvements:
- Add hint attempt counter
- Show hint automatically after 3 failed attempts
- Multiple hints (progressive disclosure)
- Animated emoji in hint box
- Sound effect when hint appears
