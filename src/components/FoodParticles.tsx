"use client"

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

const FOOD_EMOJIS = ['🥗', '🍎', '🥑', '🍕', '🍜', '🥕', '🍓', '🥦'];

export function FoodParticles({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
      left: Math.random() * 100,
      size: Math.random() * 20 + 20, // 20-40px
      duration: Math.random() * 15 + 15, // 15-30s
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute opacity-30 animate-float-particle"
          style={{
            left: `${particle.left}%`,
            bottom: '-50px',
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
}
