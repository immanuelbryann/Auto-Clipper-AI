import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#080808] font-bold ' +
    'hover:from-gold hover:to-gold-light shadow-gold-sm hover:shadow-gold ' +
    'active:scale-[0.98]',
  secondary:
    'bg-bg-elevated text-text-primary border border-border ' +
    'hover:border-border-active hover:bg-bg-surface',
  outline:
    'bg-transparent text-gold border border-gold/40 ' +
    'hover:border-gold/70 hover:bg-gold/5',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-surface',
  danger:
    'bg-gradient-to-r from-danger to-danger-hover text-white font-semibold ' +
    'hover:from-danger-hover hover:to-red-500 shadow-sm active:scale-[0.98]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs  gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm  gap-2   rounded-button',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-button',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className={`shrink-0 ${children ? (size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4') : 'w-4 h-4'}`} />
      ) : null}
      {children}
      {IconRight && !loading && (
        <IconRight className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
