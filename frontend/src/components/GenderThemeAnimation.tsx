import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  emoji: string;
}

const EMOJIS = ['🌸', '✨', '💕', '🌺', '⭐', '💖', '🌸', '✨'];

export default function GenderThemeAnimation({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setPetals([]);
      return;
    }

    // Generate petals
    const newPetals: Petal[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      size: 16 + Math.random() * 20,
      rotation: Math.random() * 360,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));

    setPetals(newPetals);
    setVisible(true);

    // Fade out after animation
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [active]);

  if (!visible || petals.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-sakura-fall"
          style={{
            left: `${petal.x}%`,
            top: '-60px',
            fontSize: `${petal.size}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            transform: `rotate(${petal.rotation}deg)`,
            opacity: 0,
          }}
        >
          {petal.emoji}
        </div>
      ))}
    </div>
  );
}
