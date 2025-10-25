import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BookOpen, Code, Lightbulb, Sparkles } from "lucide-react";

interface StoryFrame {
  text: string;
  visual: string;
  emoji: string;
}

interface Concept {
  title: string;
  description: string;
  example: string;
  icon: string;
  story: StoryFrame[];
}

interface LanguageConcepts {
  [key: string]: Concept[];
}

const languageConcepts: LanguageConcepts = {
  python: [
    {
      title: "Indentation Matters",
      description: "Python uses indentation to define code blocks instead of braces.",
      example: "if x > 5:\n    print('Greater')\n    print('Than 5')",
      icon: "🐍",
      story: [
        { text: "Meet Py the Python! 🐍", visual: "A friendly snake appears", emoji: "🐍" },
        { text: "Py loves clean, organized code", visual: "Snake arranging blocks neatly", emoji: "📦" },
        { text: "Instead of curly braces { }, Py uses spaces", visual: "Spaces pushing braces away", emoji: "↔️" },
        { text: "Each indent level = one code block!", visual: "Stacked blocks with arrows", emoji: "⬇️" },
        { text: "Now Py's code is beautiful and readable! ✨", visual: "Happy snake with clean code", emoji: "✨" }
      ]
    },
    {
      title: "Dynamic Typing",
      description: "Variables don't need type declarations - Python figures it out!",
      example: "x = 5  # integer\nx = 'hello'  # now a string",
      icon: "✨",
      story: [
        { text: "Meet Variable V! 📦", visual: "A shape-shifting box", emoji: "📦" },
        { text: "V can hold numbers...", visual: "Box containing number 5", emoji: "5️⃣" },
        { text: "Then suddenly become text!", visual: "Box morphing to hold 'hello'", emoji: "💬" },
        { text: "Python automatically knows what type V is", visual: "Python detecting type", emoji: "🔍" },
        { text: "V is a magical shape-shifter! 🎭", visual: "Box celebrating flexibility", emoji: "🎭" }
      ]
    },
    {
      title: "List Comprehensions",
      description: "Create lists in a single, elegant line of code.",
      example: "squares = [x**2 for x in range(10)]",
      icon: "📝",
      story: [
        { text: "Meet Loop the Robot! 🤖", visual: "A robot with a conveyor belt", emoji: "🤖" },
        { text: "Loop needs to square numbers 0-9", visual: "Numbers on conveyor belt", emoji: "🔢" },
        { text: "Old way: Write 5 lines of code", visual: "Long scrolling code", emoji: "📜" },
        { text: "New way: One magical line!", visual: "Single glowing line", emoji: "✨" },
        { text: "Loop finishes in record time! ⚡", visual: "Robot celebrating", emoji: "🎉" }
      ]
    }
  ],
  javascript: [
    {
      title: "Async/Await",
      description: "Handle asynchronous operations with clean, readable code.",
      example: "async function getData() {\n  const data = await fetch(url);\n  return data.json();\n}",
      icon: "⚡",
      story: [
        { text: "Meet Async the Time Traveler! ⏰", visual: "Character with clock", emoji: "⏰" },
        { text: "Async needs data from a distant server", visual: "Server far away", emoji: "🌐" },
        { text: "Old way: Callback chaos! 😵", visual: "Tangled callback pyramid", emoji: "🌀" },
        { text: "New way: 'await' pauses time gracefully", visual: "Time freezing elegantly", emoji: "⏸️" },
        { text: "Code reads like a story! 📖", visual: "Clean sequential code", emoji: "✨" }
      ]
    },
    {
      title: "Arrow Functions",
      description: "Concise function syntax with lexical 'this' binding.",
      example: "const add = (a, b) => a + b;",
      icon: "➡️",
      story: [
        { text: "Meet Arrow the Archer! 🏹", visual: "Archer with bow", emoji: "🏹" },
        { text: "Arrow writes functions super fast", visual: "Quick arrow shots", emoji: "⚡" },
        { text: "Old way: function(a, b) { return a + b }", visual: "Long bow and arrow", emoji: "📏" },
        { text: "Arrow way: (a, b) => a + b", visual: "Compact crossbow", emoji: "🎯" },
        { text: "Bullseye! Short and sweet! 🎯", visual: "Arrow hitting target", emoji: "🎯" }
      ]
    },
    {
      title: "Destructuring",
      description: "Extract values from objects and arrays easily.",
      example: "const { name, age } = person;\nconst [first, second] = array;",
      icon: "📦",
      story: [
        { text: "Meet Unpack the Treasure Hunter! 💎", visual: "Explorer with treasure chest", emoji: "🗺️" },
        { text: "Unpack finds a treasure chest (object)", visual: "Locked treasure chest", emoji: "📦" },
        { text: "Old way: Open, search, grab each item", visual: "Slow manual extraction", emoji: "🔍" },
        { text: "Destructuring: Grab everything at once!", visual: "Items flying out neatly", emoji: "✨" },
        { text: "All treasures extracted instantly! 💰", visual: "Happy with organized loot", emoji: "🎉" }
      ]
    }
  ],
  cpp: [
    {
      title: "Pointers & References",
      description: "Direct memory access for powerful, efficient code.",
      example: "int* ptr = &value;\nint& ref = value;",
      icon: "⚙️",
      story: [
        { text: "Meet Pointer the Navigator! 🧭", visual: "Character with compass", emoji: "🧭" },
        { text: "Pointer knows exact memory addresses", visual: "Map with coordinates", emoji: "📍" },
        { text: "Instead of copying data...", visual: "Heavy boxes being moved", emoji: "📦" },
        { text: "Pointer just points to it!", visual: "Arrow pointing to location", emoji: "➡️" },
        { text: "Super fast and memory efficient! ⚡", visual: "Lightning speed", emoji: "🚀" }
      ]
    },
    {
      title: "Templates",
      description: "Write generic code that works with any data type.",
      example: "template<typename T>\nT max(T a, T b) { return a > b ? a : b; }",
      icon: "🔧",
      story: [
        { text: "Meet Template the Shapeshifter! 🎭", visual: "Magical transformer", emoji: "🎭" },
        { text: "Template writes ONE function...", visual: "Single glowing function", emoji: "✨" },
        { text: "That works with integers!", visual: "Function handling numbers", emoji: "🔢" },
        { text: "AND strings! AND anything!", visual: "Function handling everything", emoji: "🌟" },
        { text: "One code, infinite possibilities! ♾️", visual: "Expanding universe", emoji: "🌌" }
      ]
    },
    {
      title: "RAII Pattern",
      description: "Resource Acquisition Is Initialization - automatic cleanup!",
      example: "std::unique_ptr<int> ptr(new int(5));\n// Automatically deleted",
      icon: "🛡️",
      story: [
        { text: "Meet Guard the Protector! 🛡️", visual: "Knight with shield", emoji: "🛡️" },
        { text: "Guard allocates memory resources", visual: "Opening treasure vault", emoji: "🏦" },
        { text: "When done, Guard auto-cleans up!", visual: "Automatic cleanup", emoji: "🧹" },
        { text: "No memory leaks! No manual delete!", visual: "Perfect clean room", emoji: "✨" },
        { text: "Guard keeps memory safe! 🔒", visual: "Locked and secure", emoji: "🔐" }
      ]
    }
  ],
  java: [
    {
      title: "Object-Oriented",
      description: "Everything is an object with classes and inheritance.",
      example: "public class Dog extends Animal {\n  public void bark() { }\n}",
      icon: "☕",
      story: [
        { text: "Meet Java the Architect! 🏗️", visual: "Builder with blueprints", emoji: "🏗️" },
        { text: "Java builds with CLASSES (blueprints)", visual: "Blueprint of Animal", emoji: "📐" },
        { text: "Dog EXTENDS Animal (inheritance)", visual: "Dog inheriting from Animal", emoji: "🐕" },
        { text: "Dog gets all Animal features + bark!", visual: "Dog with superpowers", emoji: "🦸" },
        { text: "Everything is an object! 🎯", visual: "World of objects", emoji: "🌍" }
      ]
    },
    {
      title: "Interfaces",
      description: "Define contracts that classes must implement.",
      example: "interface Drawable {\n  void draw();\n}",
      icon: "🔌",
      story: [
        { text: "Meet Interface the Contract Writer! 📜", visual: "Lawyer with contract", emoji: "📜" },
        { text: "Interface says: 'You MUST have draw()'", visual: "Contract with requirements", emoji: "✍️" },
        { text: "Circle signs the contract", visual: "Circle agreeing", emoji: "⭕" },
        { text: "Square signs too!", visual: "Square agreeing", emoji: "⬜" },
        { text: "All shapes can now draw! 🎨", visual: "Shapes drawing together", emoji: "🎨" }
      ]
    },
    {
      title: "Exception Handling",
      description: "Robust error handling with try-catch blocks.",
      example: "try {\n  // code\n} catch (Exception e) {\n  // handle\n}",
      icon: "🚨",
      story: [
        { text: "Meet Catcher the Safety Net! 🥅", visual: "Acrobat with safety net", emoji: "🥅" },
        { text: "Catcher TRYs risky operations", visual: "Tightrope walking", emoji: "🎪" },
        { text: "Uh oh! An error falls!", visual: "Error falling", emoji: "⚠️" },
        { text: "CATCH saves the day!", visual: "Net catching error", emoji: "🎯" },
        { text: "Program keeps running safely! ✅", visual: "Happy safe program", emoji: "✅" }
      ]
    }
  ]
};

export const TeacherAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [storyFrame, setStoryFrame] = useState(0);
  const [isPlayingStory, setIsPlayingStory] = useState(false);

  const handleAvatarClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setIsOpen(true);
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentConceptIndex(0);
    setStoryFrame(0);
    setIsPlayingStory(false);
  };

  const playStory = () => {
    setIsPlayingStory(true);
    setStoryFrame(0);
  };

  const nextStoryFrame = () => {
    if (currentConcept && storyFrame < currentConcept.story.length - 1) {
      setStoryFrame(prev => prev + 1);
    } else {
      setIsPlayingStory(false);
      setStoryFrame(0);
    }
  };

  const prevStoryFrame = () => {
    if (storyFrame > 0) {
      setStoryFrame(prev => prev - 1);
    }
  };

  const nextConcept = () => {
    if (selectedLanguage) {
      const concepts = languageConcepts[selectedLanguage];
      setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
      setStoryFrame(0);
      setIsPlayingStory(false);
    }
  };

  const prevConcept = () => {
    if (selectedLanguage) {
      const concepts = languageConcepts[selectedLanguage];
      setCurrentConceptIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
      setStoryFrame(0);
      setIsPlayingStory(false);
    }
  };

  const currentConcept = selectedLanguage 
    ? languageConcepts[selectedLanguage][currentConceptIndex]
    : null;

  return (
    <>
      {/* Floating Avatar */}
      <div
        className={`fixed bottom-8 right-8 z-50 cursor-pointer transition-all duration-300 ${
          isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
        } hover:scale-105`}
        onClick={handleAvatarClick}
      >
        <div className="relative">
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl animate-bounce-slow">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          
          {/* Sparkles */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Learn Key Concepts! 🚀
          </div>
        </div>
      </div>

      {/* Learning Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="cyber-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-game text-2xl font-bold">Code Mentor</h2>
                  <p className="text-sm text-muted-foreground">Learn programming concepts</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedLanguage(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!selectedLanguage ? (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground mb-6">
                  Choose a language to explore its key concepts!
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(languageConcepts).map((lang) => (
                    <Button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className="h-24 text-lg font-game capitalize bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border-2 border-primary/30"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">
                          {lang === 'python' && '🐍'}
                          {lang === 'javascript' && '⚡'}
                          {lang === 'cpp' && '⚙️'}
                          {lang === 'java' && '☕'}
                        </span>
                        <span>{lang}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedLanguage(null)}
                  >
                    ← Back to Languages
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {currentConceptIndex + 1} / {languageConcepts[selectedLanguage].length}
                    </span>
                  </div>
                </div>

                {currentConcept && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Concept Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-4xl">
                        {currentConcept.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-game text-2xl font-bold">{currentConcept.title}</h3>
                        <p className="text-muted-foreground">{currentConcept.description}</p>
                      </div>
                      <Button
                        onClick={playStory}
                        className="bg-gradient-to-r from-accent to-primary"
                      >
                        📖 Watch Story
                      </Button>
                    </div>

                    {/* Animated Story */}
                    {isPlayingStory && (
                      <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 border-primary/30 animate-fade-in">
                        <div className="text-center space-y-6">
                          {/* Story Frame */}
                          <div className="text-8xl animate-bounce-slow">
                            {currentConcept.story[storyFrame].emoji}
                          </div>
                          <p className="text-xl font-game text-primary">
                            {currentConcept.story[storyFrame].text}
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            {currentConcept.story[storyFrame].visual}
                          </p>

                          {/* Story Navigation */}
                          <div className="flex items-center justify-between pt-4">
                            <Button
                              onClick={prevStoryFrame}
                              disabled={storyFrame === 0}
                              variant="outline"
                              size="sm"
                            >
                              ← Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {storyFrame + 1} / {currentConcept.story.length}
                            </span>
                            <Button
                              onClick={nextStoryFrame}
                              size="sm"
                              className="bg-gradient-to-r from-primary to-secondary"
                            >
                              {storyFrame < currentConcept.story.length - 1 ? 'Next →' : 'Finish ✓'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Code Example */}
                    <Card className="bg-black/50 p-6 border-primary/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-primary" />
                        <span className="text-sm font-game text-primary">Example Code</span>
                      </div>
                      <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                        {currentConcept.example}
                      </pre>
                    </Card>

                    {/* Animated Tip */}
                    <Card className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 border-accent/30">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="text-sm font-semibold text-accent mb-1">Pro Tip</p>
                          <p className="text-sm text-muted-foreground">
                            Practice this concept in the debugging challenges to master it!
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Navigation */}
                    <div className="flex gap-3">
                      <Button
                        onClick={prevConcept}
                        variant="outline"
                        className="flex-1"
                      >
                        ← Previous
                      </Button>
                      <Button
                        onClick={nextConcept}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};
