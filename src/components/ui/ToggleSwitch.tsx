import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled, id }) => {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        checked
          ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-gold-sm'
          : 'bg-bg-surface border border-border',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md',
          'transition-transform duration-300 ease-in-out',
          checked ? 'translate-x-5 bg-[#080808]' : 'translate-x-0 bg-text-secondary',
        ].join(' ')}
      />
    </button>
  );
};
