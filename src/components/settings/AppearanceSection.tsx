import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette } from 'lucide-react';

interface AppearanceSectionProps {
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
}

const themeOptions = [
  { value: 'dark'   as const, icon: '🌙', label: 'Dark' },
  { value: 'light'  as const, icon: '☀️', label: 'Light' },
  { value: 'system' as const, icon: '💻', label: 'System' },
];

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ theme, setTheme }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-bg-secondary rounded-card border border-border p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gold/10 rounded-lg text-gold">
          <Palette className="w-5 h-5" />
        </div>
        <h2 className="text-section-title text-text-primary">Appearance</h2>
      </div>

      <div className="space-y-5">
        {/* Theme picker */}
        <div>
          <label className="text-label text-text-secondary block mb-2">
            {t('settings.theme', 'Theme')}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {themeOptions.map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={[
                  'py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-200',
                  'flex items-center justify-center gap-2',
                  theme === value
                    ? 'border-gold/60 bg-gold/10 text-gold shadow-gold-sm'
                    : 'border-border bg-bg-surface text-text-secondary hover:border-border-active hover:text-text-primary',
                ].join(' ')}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language picker */}
        <div>
          <label className="text-label text-text-secondary block mb-2">
            {t('settings.language', 'Language')}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { value: 'id', flag: '🇮🇩', label: 'Indonesia' },
              { value: 'en', flag: '🇬🇧', label: 'English' },
            ].map(({ value, flag, label }) => (
              <button
                key={value}
                onClick={() => i18n.changeLanguage(value)}
                className={[
                  'py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-200',
                  'flex items-center justify-center gap-2',
                  i18n.language === value
                    ? 'border-gold/60 bg-gold/10 text-gold shadow-gold-sm'
                    : 'border-border bg-bg-surface text-text-secondary hover:border-border-active hover:text-text-primary',
                ].join(' ')}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
