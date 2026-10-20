import React from 'react';
import { useEmoti } from '../../context/EmotiContext';

export const SparkBurstAnimation: React.FC = () => {
  const { sparkBurstActive } = useEmoti();

  if (!sparkBurstActive) return null;

  // Render a burst of particles radiating outward
  const particles = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * 2 * Math.PI;
    const distance = 80 + (i % 3) * 35;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const colors = ['#DCD5F5', '#F5DFD3', '#D9E8DE', '#DCEAF4', '#FFD166'];
    const color = colors[i % colors.length];
    const size = 6 + (i % 4) * 3;

    return { id: i, x, y, color, size };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Central glow */}
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-purple-300/40 blur-xl animate-ping" />

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full shadow-xs"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              transform: `translate(${p.x}px, ${p.y}px)`,
              transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: 0,
              animation: `spark-burst 1.8s forwards`,
            }}
          />
        ))}

        {/* Floating icon */}
        <div className="text-3xl animate-bounce">✨</div>
      </div>
    </div>
  );
};
