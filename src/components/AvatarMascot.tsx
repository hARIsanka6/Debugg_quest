import { useEffect, useState } from "react";
import { Bug } from "lucide-react";

type MascotState = "idle" | "thinking" | "wrong" | "correct" | "hint";

interface AvatarMascotProps {
  state: MascotState;
  onAnimationComplete?: () => void;
}

export const AvatarMascot = ({
  state,
  onAnimationComplete,
}: AvatarMascotProps) => {
  const [currentState, setCurrentState] = useState<MascotState>("idle");
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechText, setSpeechText] = useState("");

  useEffect(() => {
    setCurrentState(state);

    // Show speech bubble for certain states
    if (state === "wrong" || state === "correct" || state === "hint") {
      setShowSpeechBubble(true);

      // Set speech text based on state
      if (state === "wrong") {
        const wrongMessages = [
          "Oops! Try again! 😏",
          "Not quite! 😅",
          "So close! 🤔",
          "Hmm... nope! 😬",
          "Nice try! 😆",
        ];
        setSpeechText(
          wrongMessages[Math.floor(Math.random() * wrongMessages.length)]
        );
      } else if (state === "correct") {
        const correctMessages = [
          "Awesome! 🎉",
          "You did it! 🌟",
          "Perfect! 🏆",
          "Brilliant! ✨",
          "Nailed it! 🎯",
        ];
        setSpeechText(
          correctMessages[Math.floor(Math.random() * correctMessages.length)]
        );
      } else if (state === "hint") {
        setSpeechText("Need help? 💡");
      }

      // Hide speech bubble after animation
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
        if (onAnimationComplete) onAnimationComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state, onAnimationComplete]);

  // Get face expression based on state
  const getFaceExpression = () => {
    switch (currentState) {
      case "wrong":
        return (
          <g className="animate-shake">
            {/* Teasing/Smirking face */}
            {/* Eyes */}
            <ellipse
              cx="35"
              cy="40"
              rx="4"
              ry="6"
              fill="#2D3748"
              className="animate-blink"
            />
            <ellipse
              cx="65"
              cy="40"
              rx="4"
              ry="6"
              fill="#2D3748"
              className="animate-blink"
            />
            {/* Eyebrows raised (teasing) */}
            <path
              d="M 28 32 Q 35 28 42 32"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 58 32 Q 65 28 72 32"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Smirk */}
            <path
              d="M 35 60 Q 50 68 65 60"
              stroke="#2D3748"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tongue sticking out slightly */}
            <ellipse cx="50" cy="65" rx="6" ry="4" fill="#FF6B9D" />
          </g>
        );

      case "correct":
        return (
          <g className="animate-bounce-gentle">
            {/* Happy/Excited face */}
            {/* Eyes (wide open, happy) */}
            <circle cx="35" cy="40" r="5" fill="#2D3748" />
            <circle cx="65" cy="40" r="5" fill="#2D3748" />
            {/* Sparkles in eyes */}
            <circle cx="37" cy="38" r="2" fill="white" />
            <circle cx="67" cy="38" r="2" fill="white" />
            {/* Eyebrows (happy arch) */}
            <path
              d="M 25 30 Q 35 26 45 30"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 55 30 Q 65 26 75 30"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Big smile */}
            <path
              d="M 30 55 Q 50 70 70 55"
              stroke="#2D3748"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Cheeks (blushing) */}
            <circle cx="20" cy="50" r="8" fill="#FF6B9D" opacity="0.3" />
            <circle cx="80" cy="50" r="8" fill="#FF6B9D" opacity="0.3" />
          </g>
        );

      case "thinking":
        return (
          <g className="animate-think">
            {/* Thinking face */}
            {/* Eyes looking up */}
            <ellipse cx="35" cy="38" rx="4" ry="5" fill="#2D3748" />
            <ellipse cx="65" cy="38" rx="4" ry="5" fill="#2D3748" />
            {/* Eyebrows (concentrated) */}
            <path
              d="M 28 32 L 42 30"
              stroke="#2D3748"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 72 32 L 58 30"
              stroke="#2D3748"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Mouth (pondering) */}
            <path
              d="M 40 60 L 60 60"
              stroke="#2D3748"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        );

      case "hint":
        return (
          <g className="animate-pulse-gentle">
            {/* Helpful face */}
            {/* Eyes (friendly) */}
            <ellipse cx="35" cy="40" rx="4" ry="5" fill="#2D3748" />
            <ellipse cx="65" cy="40" rx="4" ry="5" fill="#2D3748" />
            {/* Eyebrows (friendly) */}
            <path
              d="M 28 33 Q 35 30 42 33"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 58 33 Q 65 30 72 33"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Gentle smile */}
            <path
              d="M 35 58 Q 50 65 65 58"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );

      default: // idle
        return (
          <g className="animate-idle-bob">
            {/* Neutral/Friendly face */}
            {/* Eyes */}
            <ellipse
              cx="35"
              cy="40"
              rx="4"
              ry="5"
              fill="#2D3748"
              className="animate-blink-slow"
            />
            <ellipse
              cx="65"
              cy="40"
              rx="4"
              ry="5"
              fill="#2D3748"
              className="animate-blink-slow"
            />
            {/* Eyebrows */}
            <path
              d="M 28 33 Q 35 31 42 33"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 58 33 Q 65 31 72 33"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Smile */}
            <path
              d="M 38 58 Q 50 63 62 58"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  return (
    <div className="relative">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce-in">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-lg border-2 border-primary/30">
            <p className="text-sm font-game text-green-400 whitespace-nowrap">
              {speechText}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
          </div>
        </div>
      )}

      {/* Avatar Container */}
      <div className="relative w-32 h-32">
        {/* Glow effect based on state */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
            currentState === "correct"
              ? "bg-terminal/30 animate-glow-pulse"
              : currentState === "wrong"
              ? "bg-destructive/30 animate-pulse"
              : currentState === "hint"
              ? "bg-accent/30"
              : "bg-primary/20"
          }`}
        />

        {/* Main Avatar SVG */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-lg"
        >
          {/* Head */}
          <circle
            cx="50"
            cy="50"
            r="40"
            className={`transition-all duration-300 ${
              currentState === "correct"
                ? "fill-terminal/20"
                : currentState === "wrong"
                ? "fill-destructive/20"
                : "fill-primary/20"
            }`}
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="url(#avatarGradient)"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-colors duration-300 ${
              currentState === "correct"
                ? "stroke-terminal"
                : currentState === "wrong"
                ? "stroke-destructive"
                : "stroke-primary"
            }`}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="avatarGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.1"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--secondary))"
                stopOpacity="0.1"
              />
            </linearGradient>
          </defs>

          {/* Bug antenna (mascot is a bug character) */}
          <g className="animate-antenna-wiggle">
            <line
              x1="35"
              y1="15"
              x2="30"
              y2="5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-primary"
            />
            <line
              x1="65"
              y1="15"
              x2="70"
              y2="5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-primary"
            />
            <circle cx="30" cy="5" r="3" className="fill-accent" />
            <circle cx="70" cy="5" r="3" className="fill-accent" />
          </g>

          {/* Face Expression */}
          {getFaceExpression()}
        </svg>

        {/* Floating particles for correct state */}
        {currentState === "correct" && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-accent animate-float-particle"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
