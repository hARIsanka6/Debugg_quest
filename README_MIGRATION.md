# 🚀 Quick Start - Database Setup

## IMPORTANT: Run This First!

Before using the app, you need to set up the challenges in Supabase.

### 1-Minute Setup

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `zfjatzkyeqnruwqzzbyp`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left menu
   - Click "New Query"

3. **Run Migration**
   - Open the file: `supabase_migration_challenges.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" button (or press Ctrl+Enter)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - Run this to check: `SELECT COUNT(*) FROM challenges;`
   - Should return: 20

### That's It!

Now you can use the app:
```bash
npm run dev
```

The app will load challenges from Supabase instead of local files.

## What Changed?

### Before ❌
- Challenges stored in `src/data/debuggingChallenges.ts`
- Hard to update without code changes
- Not flexible

### After ✅
- Challenges stored in Supabase database
- Easy to add/edit via SQL or admin UI
- Centralized and scalable
- Better validation system

## New Features

### Improved Code Validation
The app now accepts solutions that are functionally correct, even if formatting differs:

**Example - Python Colon Fix:**

All of these are now accepted:
```python
def greet(name):
    return f"Hello, {name}!"
```

```python
def greet(name):
    return f"Hello, {name}!"
```

The validator ignores:
- Extra/missing whitespace
- Different quote styles (' vs ")
- Case differences in some contexts

### Better Feedback
When your solution is wrong, you get helpful hints:
- "You haven't made any changes yet"
- "You're very close! Check for small syntax differences"
- "You're on the right track! Review the error message"

## Troubleshooting

### "Challenge not found" error
→ You haven't run the SQL migration yet. Follow steps above.

### "Permission denied" in SQL Editor
→ Make sure you're logged in as the project owner.

### Challenges not loading
1. Check browser console for errors
2. Verify migration ran: `SELECT * FROM challenges LIMIT 1;`
3. Check `.env` file has correct Supabase URL and key

## Need Help?

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.
