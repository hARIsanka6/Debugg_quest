# 🐛 Debugg Quest Adventure

<div me to Debugg Quest Adventure! This guide will help you clone and run this epic space-themed debugging game.
</br>
### Language Selection
<img width="700" height="600" alt="Language Selection" src="https://github.com/user-attachments/assets/2b50cbad-6901-46ed-b151-f492ff23a24f" />
</br>

### Level Selection

<img width="700" height="600" alt="Screenshot 2025-10-25 164052" src="https://github.com/user-attachments/assets/2f0cccab-b67f-44a7-80da-6bd18c3dc037" />

</br>

### Debugg

<img width="700" height="600" alt="Screenshot 2025-10-25 164113" src="https://github.com/user-attachments/assets/fe39a00f-5a72-4529-a2ac-5336be9ab537" />

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- A **Supabase account** (free tier works!) - [Sign up here](https://supabase.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd debugg-quest-adventure
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

#### Get Your Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL
   - `anon` public key

#### Run Database Migrations

1. In your Supabase project, go to the SQL Editor
2. Run the following migration files in order:
   - `supabase_migration_challenges.sql` (creates challenges table)
   - `supabase_migration_more_badges.sql` (creates badges system)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

## 🎮 First Time Setup

### Create Your Account

1. Navigate to the Auth page
2. Click "Sign Up"
3. Enter your email, password, and username
4. Check your email for confirmation
5. Once confirmed, sign in!

### Explore the Features

- **Language Selection**: Choose from Python, JavaScript, C++, or Java
- **Level Map**: Navigate through debugging challenges
- **Code Editor**: Fix bugs with syntax highlighting
- **Teacher Avatar**: Learn concepts through animated stories
- **Profile**: Track your progress and badges
- **Leaderboard**: Compete with other debuggers

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
debugg-quest-adventure/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AvatarMascot.tsx
│   │   ├── TeacherAvatar.tsx
│   │   ├── SpaceBackground.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Auth.tsx
│   │   ├── LanguageSelect.tsx
│   │   ├── LevelMap.tsx
│   │   ├── LevelPlay.tsx
│   │   └── ...
│   ├── lib/                # Utility functions
│   ├── integrations/       # Supabase integration
│   ├── data/              # Static data
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── supabase_migration_*.sql  # Database migrations
└── ...
```

## 🎨 Key Features

### 🌌 Immersive Space Theme

- Animated wormhole background on Auth page
- Space battle backgrounds
- Floating planets with orbiting text
- Retro space invaders mini-game

### 🎵 Epic Audio

- Star Wars-inspired background music
- Sound effects for interactions
- Voice synthesis for feedback
- Ambient music toggle

### 🎓 Interactive Learning

- Animated story-based concept teaching
- Character-driven narratives
- Visual code examples
- Progressive difficulty

### 🏆 Gamification

- XP and leveling system
- 60+ unique badges
- Streak tracking
- Global leaderboard
- Performance analytics

### 💻 Advanced Code Editor

- Syntax highlighting
- Real-time validation
- Hint system
- Multiple language support

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Supabase Connection Issues

1. Verify your `.env` file has correct credentials
2. Check if your Supabase project is active
3. Ensure you've run all database migrations
4. Check browser console for specific errors

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Audio Not Playing

1. Click the ambient music toggle button
2. Check browser console for audio context errors
3. Some browsers require user interaction before playing audio
4. Ensure your browser supports Web Audio API

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🎉 Have Fun!

Embark on your debugging adventure through space! Fix bugs, earn badges, and become a master debugger!

---

**Need help?** Check the other documentation files:

- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `FEATURES.md` - Complete feature list
- `QUICKSTART.md` - Quick reference guide

Happy Debugging! 🚀🐛
