import React from 'react';

interface VoiceWaveVisualizerProps {
  state: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';
  barCount?: number;
  colorHex?: string;
}

export const VoiceWaveVisualizer: React.FC<VoiceWaveVisualizerProps> = ({
  state,
  barCount = 12,
  colorHex = '#8BE9FD',
}) => {
  if (state === 'IDLE') return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-8 px-3">
      {Array.from({ length: barCount }).map((_, i) => {
        let animationClass = '';
        let heightStyle = 'h-1.5';

        if (state === 'LISTENING') {
          // Dynamic pulsing heights for listening
          animationClass = 'animate-pulse';
          const heights = ['h-2', 'h-4', 'h-6', 'h-5', 'h-3', 'h-7', 'h-4', 'h-6', 'h-3', 'h-5', 'h-2', 'h-4'];
          heightStyle = heights[i % heights.length];
        } else if (state === 'SPEAKING') {
          // Rhythmic dancing wave for speaking
          animationClass = 'animate-bounce';
          const heights = ['h-3', 'h-7', 'h-5', 'h-8', 'h-4', 'h-6', 'h-7', 'h-3', 'h-6', 'h-5', 'h-7', 'h-4'];
          heightStyle = heights[i % heights.length];
        } else if (state === 'THINKING') {
          // Subtle harmonic wave
          animationClass = 'animate-pulse';
          heightStyle = i % 2 === 0 ? 'h-3' : 'h-1.5';
        }

        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${heightStyle} ${animationClass}`}
            style={{
              backgroundColor: state === 'ERROR' ? '#EF4444' : colorHex,
              animationDelay: `${i * 90}ms`,
              boxShadow: state === 'ERROR' ? '0 0 6px rgba(239, 68, 68, 0.6)' : `0 0 8px ${colorHex}`,
            }}
          />
        );
      })}
    </div>
  );
};
