import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  helperText?: string;
  icon?: LucideIcon;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-label text-text-secondary">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        )}
        <select
          {...props}
          className={[
            'w-full appearance-none rounded-input border bg-input-bg text-text-primary',
            'py-2.5 pr-9 transition-all duration-200',
            'focus:outline-none focus:border-gold/60 focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)]',
            'hover:border-border-active',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            Icon ? 'pl-9' : 'pl-3',
            'border-border',
            className,
          ].join(' ')}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-elevated">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && (
        <p className="text-caption text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
};
