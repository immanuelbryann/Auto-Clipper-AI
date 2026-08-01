import React from 'react';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'gold';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  error:   'bg-danger/15 text-red-400 border border-danger/25',
  warning: 'bg-warning/15 text-amber-400 border border-warning/25',
  info:    'bg-info/15 text-blue-400 border border-info/25',
  neutral: 'bg-bg-surface text-text-secondary border border-border',
  gold:    'bg-gold/15 text-gold border border-gold/25',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-badge text-caption font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
