import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  helperText?: string;
  error?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  icon: Icon,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random()}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-label text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        )}
        <input
          id={inputId}
          {...props}
          className={[
            'w-full rounded-input border bg-input-bg text-text-primary placeholder:text-text-tertiary',
            'py-2.5 transition-all duration-200',
            'focus:outline-none focus:border-gold/60 focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]',
            'hover:border-border-active',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            Icon ? 'pl-9 pr-4' : 'px-4',
            error ? 'border-danger/60 focus:border-danger focus:shadow-[0_0_0_2px_rgba(192,57,43,0.2)]' : 'border-border',
            className,
          ].join(' ')}
        />
      </div>
      {helperText && !error && (
        <p className="text-caption text-text-tertiary">{helperText}</p>
      )}
      {error && (
        <p className="text-caption text-danger">{error}</p>
      )}
    </div>
  );
};
