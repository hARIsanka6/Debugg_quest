import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        terminal: {
          DEFAULT: "hsl(var(--terminal))",
          foreground: "hsl(var(--terminal-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        game: ["Orbitron", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.6)" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "level-unlock": {
          "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: "0" },
          "50%": { transform: "scale(1.1) rotate(2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "celebration": {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "50%": { transform: "scale(1.1) rotate(10deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-3px) rotate(-2deg)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(3px) rotate(2deg)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "think": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "idle-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "blink": {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        "blink-slow": {
          "0%, 96%, 100%": { transform: "scaleY(1)" },
          "98%": { transform: "scaleY(0.1)" },
        },
        "antenna-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        "bounce-in": {
          "0%": { transform: "translate(-50%, -20px) scale(0)", opacity: "0" },
          "50%": { transform: "translate(-50%, 0) scale(1.1)", opacity: "1" },
          "100%": { transform: "translate(-50%, 0) scale(1)", opacity: "1" },
        },
        "float-particle": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-50px) scale(0)", opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -20px)" },
          "50%": { transform: "translate(-10px, -40px)" },
          "75%": { transform: "translate(5px, -60px)" },
        },
        "glow-pulse-slow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-slower": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "level-unlock": "level-unlock 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "confetti": "confetti 3s ease-out forwards",
        "celebration": "celebration 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "shake": "shake 0.5s ease-in-out",
        "bounce-gentle": "bounce-gentle 0.6s ease-in-out 3",
        "think": "think 2s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "idle-bob": "idle-bob 3s ease-in-out infinite",
        "blink": "blink 4s ease-in-out infinite",
        "blink-slow": "blink-slow 6s ease-in-out infinite",
        "antenna-wiggle": "antenna-wiggle 3s ease-in-out infinite",
        "bounce-in": "bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "float-particle": "float-particle 2s ease-out forwards",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "glow-pulse-slow": "glow-pulse-slow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "spin-slower": "spin-slower 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
