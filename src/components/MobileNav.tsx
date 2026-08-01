import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scissors, Wand2, Clock, Download, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/',           icon: Scissors, labelKey: 'sidebar.workspace',         label: 'Workspace' },
  { to: '/manual-ai', icon: Wand2,    labelKey: 'sidebar.manual_ai',          label: 'Manual AI' },
  { to: '/downloader', icon: Download, labelKey: 'sidebar.manual_downloader',  label: 'Downloader' },
  { to: '/history',   icon: Clock,    labelKey: 'sidebar.history',             label: 'History' },
  { to: '/settings',  icon: Settings, labelKey: 'sidebar.settings',            label: 'Settings' },
];

export const MobileNav: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 safe-bottom">
      <div className="bg-bg-secondary/95 backdrop-blur-xl border-t border-border flex items-stretch px-1">
        {navItems.map(({ to, icon: Icon, labelKey, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-1',
                'transition-all duration-200 relative group',
                'text-[10px] font-medium min-h-[56px]',
                isActive
                  ? 'text-gold'
                  : 'text-text-tertiary hover:text-text-secondary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                />
                <span className="leading-none truncate max-w-full px-0.5">
                  {t(labelKey, label)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
