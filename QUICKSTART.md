# Quick Start Guide

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Using the Application

1. Navigate to the dev server URL (check terminal output) - you'll see the landing page
2. Click "Start Your Quest" to go to the authentication page
3. **Sign Up**: Toggle to "Need an account? Sign up", enter username, email, and password
4. **Sign In**: Enter your email and password
5. **Choose Language**: Select Python, JavaScript, C++, or Java
6. **Play Levels**: Click on unlocked levels to start debugging challenges
7. **View Profile**: Check your stats, badges, and progress
8. **Leaderboard**: See how you rank against other players

## Game Features

### Level Gameplay
- Fix buggy code in the editor
- Get hints if you're stuck (first hint is free!)
- Earn XP for completing levels
- Unlock badges for achievements

### Progression System
- **XP**: Earn 50-150 XP per level
- **Levels**: Unlock sequentially (10 levels per language)
- **Badges**: 5 achievement types to unlock
- **Streak**: Maintain daily activity

### Available Challenges
- **Python**: 5 levels (syntax, indentation, type errors, etc.)
- **JavaScript**: 5 levels (variables, async, scope, etc.)
- **C++**: 5 levels (pointers, memory, arrays, etc.)
- **Java**: 5 levels (null checks, casting, exceptions, etc.)

## What Was Fixed

### CSS Layout Issue

- Fixed `#root` element in `App.css` that was restricting width and adding unwanted padding
- Changed from `max-width: 1280px` to `width: 100%` and `min-height: 100vh`
- This allows the auth form to display properly in full-screen mode

### CSS Import Order

- Moved `@import` statement for Google Fonts to the top of `index.css`
- This fixes the CSS warning about `@import` placement

### Input Fields - CRITICAL FIX

- **Root Cause**: Background gradient overlay (`absolute inset-0`) was blocking all mouse clicks
- **Solution**: Added `pointer-events-none` to background overlays in Auth and Index pages
- **Result**: Input fields now respond to clicks and display the text cursor properly
- Added `z-10` to Card component to ensure proper stacking order

## Environment Variables

The app uses Supabase for authentication. Environment variables are already configured in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase
- **State Management**: TanStack Query
- **Routing**: React Router v6
