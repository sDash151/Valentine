# Authentication & Tracking System

## Password Protection

### How It Works
1. **Entrance Page** (`/entrance`): 
   - User clicks "open it" button
   - Password prompt appears
   - Password is validated against `site_password` from settings table
   - On success: `localStorage.setItem('authenticated', 'true')`
   - User is redirected to `/home`

2. **Protected Pages** (Home, Memory Lane, Surprise):
   - Check `localStorage.getItem('authenticated') === 'true'`
   - If not authenticated → redirect to `/entrance`
   - If authenticated → show content

### Setting the Password
- Go to Admin Panel → Settings
- Set "Site Password" field
- This password is stored in the `settings` table in Supabase

## Viewed Surprises Tracking

### Current Implementation (localStorage)
Viewed surprises are tracked using browser localStorage:

**When a surprise is opened:**
```javascript
localStorage.setItem(`viewed_${surpriseId}`, 'true');
```

**Checking if viewed:**
```javascript
const isViewed = localStorage.getItem(`viewed_${surpriseId}`) === 'true';
```

**Counting viewed surprises:**
```javascript
const viewedCount = surprises.filter(s => 
  localStorage.getItem(`viewed_${s.id}`) === 'true'
).length;
```

### Pros & Cons

**Pros:**
- ✅ Simple implementation
- ✅ No database writes needed
- ✅ Fast performance
- ✅ Works offline

**Cons:**
- ❌ Only works on one device/browser
- ❌ Cleared if user clears browser data
- ❌ Not synced across devices
- ❌ Can be manipulated by tech-savvy users

### Alternative: Database Tracking

If you want cross-device tracking, you could:

1. **Create a `viewed_surprises` table:**
```sql
CREATE TABLE viewed_surprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surprise_id UUID REFERENCES surprises(id),
  viewed_at TIMESTAMP DEFAULT NOW(),
  user_identifier TEXT -- Could be IP, session ID, or user ID
);
```

2. **Track views in database:**
```javascript
// When surprise is opened
await fetch('/api/surprises/mark-viewed', {
  method: 'POST',
  body: JSON.stringify({ surpriseId })
});
```

3. **Check if viewed:**
```javascript
// Fetch viewed status from API
const res = await fetch(`/api/surprises/viewed-status`);
const { viewedIds } = await res.json();
```

## Security Considerations

### Current Security Level: Basic
- Password protection prevents casual access
- localStorage authentication is client-side only
- No server-side session management
- No protection against:
  - Browser dev tools manipulation
  - Direct API access
  - Password sharing

### For Production Use
Consider adding:
1. **Server-side sessions** with HTTP-only cookies
2. **Rate limiting** on password attempts
3. **IP-based access control** (optional)
4. **Encrypted tokens** instead of simple localStorage flag
5. **Session timeout** (auto-logout after X hours)

## Current Flow

```
User visits site
    ↓
/entrance page
    ↓
Clicks "open it"
    ↓
Password prompt
    ↓
Enters password → Validates against DB
    ↓
Success: localStorage.setItem('authenticated', 'true')
    ↓
Redirect to /home
    ↓
All pages check localStorage for 'authenticated'
    ↓
If not authenticated → redirect to /entrance
    ↓
User opens surprise
    ↓
localStorage.setItem('viewed_${id}', 'true')
    ↓
Progress counter updates based on viewed count
```

## Recommendations

### For Your Use Case (Personal Gift)
The current implementation is **perfect** because:
- It's a personal gift for one person
- She'll likely use the same device
- Simple and works well
- No need for complex authentication

### If You Want to Improve
1. **Add session timeout:**
   - Store timestamp when authenticated
   - Check if X hours have passed
   - Auto-logout if expired

2. **Add "Remember Me" option:**
   - Let user choose to stay logged in
   - Or require password each visit

3. **Move viewed tracking to database:**
   - Only if she'll use multiple devices
   - Requires user identification system

## Files Modified
- `valentine-week/app/entrance/page.tsx` - Password prompt
- `valentine-week/app/home/page.tsx` - Auth check + viewed count
- `valentine-week/app/memory-lane/page.tsx` - Auth check
- `valentine-week/app/surprise/[id]/page.tsx` - Auth check + mark as viewed
