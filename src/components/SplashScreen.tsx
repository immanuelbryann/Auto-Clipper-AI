import React, { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';

interface SplashScreenProps {
  isInitializing: boolean;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isInitializing, onFinish }) => {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isInitializing) {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return 90;
          const increment = p > 70 ? 0.4 : p > 40 ? 1.2 : 2;
          return Math.min(p + increment, 90);
        });
      }, 80);
    } else {
      setProgress(100);
      const timer = setTimeout(() => {
        setFading(true);
        setTimeout(onFinish, 500);
      }, 350);
      return () => clearTimeout(timer);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInitializing, onFinish]);

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary',
        'transition-opacity duration-500',
        fading ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center shadow-gold animate-glow">
            <Scissors className="w-10 h-10 text-[#080808]" />
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-gold/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-gold-shimmer tracking-tight leading-none">
            Auto Clipper
          </h1>
          <p className="mt-2 text-text-secondary text-sm tracking-widest uppercase">
            AI Video Clip Generator
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-56 flex flex-col items-center gap-2">
          <div className="w-full h-1 bg-bg-surface rounded-full overflow-hidden">
            <div
              className="h-full progress-gold transition-all duration-200 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-caption text-text-tertiary">
            {progress < 100 ? 'Initializing...' : 'Ready'}
          </p>
        </div>
      </div>
    </div>
  );
};
