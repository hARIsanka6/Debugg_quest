# Supabase Setup Guide

## Setting Up the Challenges Table

The application now stores all debugging challenges in Supabase instead of local files. Follow these steps to set up the database:

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to your project: `zfjatzkyeqnruwqzzbyp`
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration

1. Click **New Query** button
2. Copy the entire contents of `supabase_migration_challenges.sql`
3. Paste it into the SQL editor
4. Click **Run** or press `Ctrl+Enter`

### Step 3: Verify the Setup

After running the migration, verify that:

1. **Table Created**: Check that the `challenges` table exists
   ```sql
   SELECT * FROM challenges LIMIT 5;
   ```

2. **Data Inserted**: Verify all 20 challenges are present
   ```sql
   SELECT language, COUNT(*) as count 
   FROM challenges 
   GROUP BY language;
   ```
   
   Expected output:
   - python: 5
   - javascript: 5
   - cpp: 5
   - java: 5

3. **Policies Active**: Check Row Level Security is enabled
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'challenges';
   ```

### What the Migration Does

1. **Creates `challenges` table** with columns:
   - `id` (UUID, primary key)
   - `level` (integer, 1-10)
   - `language` (enum: python, javascript, cpp, java)
   - `title` (text)
   - `description` (text)
   - `buggy_code` (text)
   - `correct_code` (text)
   - `error_message` (text)
   - `hints` (text array)
   - `xp_reward` (integer)
   - `difficulty` (text: easy, medium, hard)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **Inserts 20 challenges**:
   - 5 Python challenges (levels 1-5)
   - 5 JavaScript challenges (levels 1-5)
   - 5 C++ challenges (levels 1-5)
   - 5 Java challenges (levels 1-5)

3. **Sets up security**:
   - Enables Row Level Security (RLS)
   - Allows anyone to read challenges
   - Allows authenticated users to insert (for admin)

4. **Creates indexes** for fast queries by language and level

5. **Adds triggers** to auto-update `updated_at` timestamp

### Troubleshooting

#### Error: "relation already exists"
If you see this error, the table already exists. You can either:
- Drop the table first: `DROP TABLE IF EXISTS challenges CASCADE;`
- Or skip to Step 3 to verify data

#### Error: "permission denied"
Make sure you're logged in as the project owner or have admin privileges.

#### No data showing in app
1. Check that the migration ran successfully
2. Verify data exists: `SELECT COUNT(*) FROM challenges;` (should return 20)
3. Check browser console for any errors
4. Ensure your `.env` file has correct Supabase credentials

### Adding More Challenges

To add new challenges (levels 6-10), use this SQL template:

```sql
INSERT INTO public.challenges (
    level, 
    language, 
    title, 
    description, 
    buggy_code, 
    correct_code, 
    error_message, 
    hints, 
    xp_reward, 
    difficulty
) VALUES (
    6,  -- level number
    'python',  -- language
    'Your Challenge Title',
    'Challenge description',
    'buggy code here',
    'correct code here',
    'Error message',
    ARRAY['Hint 1', 'Hint 2'],
    175,  -- XP reward
    'hard'  -- difficulty
);
```

### Benefits of Database Storage

✅ **Centralized**: All challenges in one place
✅ **Scalable**: Easy to add/edit challenges without code changes
✅ **Flexible**: Can add admin UI to manage challenges
✅ **Consistent**: Same data for all users
✅ **Queryable**: Can filter, search, and analyze challenges
✅ **Secure**: Row Level Security protects data

### Next Steps

After setup:
1. Restart your dev server if it's running
2. Navigate to any language level map
3. Click on a level to test the challenge loading
4. Verify the code editor shows the buggy code
5. Try solving a challenge to test validation

## Improved Code Validation

The app now uses a smarter validation system that:

- **Ignores whitespace differences**: Your code can have different spacing
- **Normalizes formatting**: Handles different quote styles
- **Case insensitive**: Focuses on logic, not casing
- **Provides feedback**: Tells you how close you are to the solution
- **Flexible matching**: Accepts variations that are functionally equivalent

### Example

These are all considered correct for "add colon" challenge:

```python
def greet(name):
    return f"Hello, {name}!"
```

```python
def greet(name):
    return f"Hello, {name}!"
```

```python
def greet(name):
    return f"Hello, {name}!"
```

The validator focuses on the key fix (adding the colon) rather than exact formatting.
