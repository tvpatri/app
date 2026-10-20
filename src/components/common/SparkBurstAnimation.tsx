import React from 'react';
import { useEmoti } from '../../context/EmotiContext';

export const SparkBurstAnimation: React.FC = () => {
  const { sparkBurstActive } = useEmoti();

  if (!sparkBurstActive) return null;

  // Render a lively colorful burst of particles radiating outward
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * 2 * Math.PI;
    const distance = 90 + (i % 4) * 35;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const colors = [
      '#FFD65A', // Amarillo
      '#72D6B1', // Verde menta
      '#FF936F', // Naranja coral
      '#79B9F2', // Azul
      '#B69AF5', // Lila
      '#FF80B5', // Rosa
    ];
    const color = colors[i % colors.length];
    const size = 8 + (i % 3) * 6;
    const icons = ['✨', '💖', '⚡', '🌟', '💫', '🎉'];
    const icon = icons[i % icons.length];

    return { id: i, x, y, color, size, icon };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Central glowing radiant orb */}
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-tr from-[#FFD65A] via-[#FF80B5] to-[#79B9F2] opacity-60 blur-2xl animate-ping" />

        {/* Particles flying out */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute flex items-center justify-center text-xs select-none"
            style={{
              transform: `translate(${p.x}px, ${p.y}px)`,
              transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'spark-burst 1.6s forwards',
            }}
          >
            {p.id % 2 === 0 ? (
              <div
                className="rounded-full shadow-[0_0_12px_currentColor]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  color: p.color,
                }}
              />
            ) : (
              <span className="text-base sm:text-lg drop-shadow-md">
                {p.icon}
              </span>
            )}
          </div>
        ))}

        {/* Floating big central sparkling heart */}
        <div className="text-5xl animate-bounce drop-shadow-[0_8px_20px_rgba(255,128,181,0.6)] select-none">
          ✨💖✨
        </div>
      </div>
    </div>
  );
};
