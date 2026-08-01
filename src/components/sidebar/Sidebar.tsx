import React from 'react';
import {
  Scissors, Clock, Settings, HelpCircle, Wand2, Download, X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/',           icon: Scissors, labelKey: 'sidebar.workspace',        label: 'Workspace',           end: true  },
  { to: '/manual-ai', icon: Wand2,    labelKey: 'sidebar.manual_ai',         label: 'Manual AI Editor',    end: false },
  { to: '/downloader', icon: Download, labelKey: 'sidebar.manual_downloader', label: 'Manual Downloader',   end: false },
  { to: '/history',   icon: Clock,    labelKey: 'sidebar.history',            label: 'History',             end: false },
];

const bottomItems = [
  { to: '/settings', icon: Settings,   labelKey: 'sidebar.settings', label: 'Settings' },
  { to: '/help',     icon: HelpCircle, labelKey: 'sidebar.help',     label: 'Help / FAQ' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const backendStatus = useBackendHealth();
  const isConnected = backendStatus === 'Connected';
  const currentYear = new Date().getFullYear();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
      'tv:px-4 tv:py-3 tv:text-base',
      isActive
        ? 'bg-gold/10 text-gold border-l-2 border-gold shadow-gold-sm'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-l-2 border-transparent',
    ].join(' ');

  return (
    <aside
      className={[
        'w-64 tv:w-72 h-screen bg-bg-secondary border-r border-border flex flex-col shrink-0',
        'transition-transform duration-300 ease-in-out',
        // Mobile: fixed overlay slide-in
        'fixed md:relative md:translate-x-0 z-40 md:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      {/* Logo area */}
      <div className="p-5 tv:p-6 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {/* Gold scissors icon */}
            <div className="p-1.5 rounded-lg bg-gold/10">
              <Scissors className="w-5 h-5 tv:w-6 tv:h-6 text-gold" />
            </div>
            <h1 className="text-lg tv:text-xl font-bold text-gold-gradient">
              Auto Clipper
            </h1>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-medium bg-gold/10 text-gold/70 px-2 py-0.5 rounded-full border border-gold/20">
              v{packageJson.version}
            </span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-bg-surface text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 tv:px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-overline text-text-tertiary px-3 mb-3">
          {t('sidebar.menu', 'Menu')}
        </p>

        {navItems.map(({ to, icon: Icon, labelKey, label, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={onClose}>
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 tv:w-5 tv:h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>{t(labelKey, label)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 tv:px-4 py-4 border-t border-border space-y-1">
        {bottomItems.map(({ to, icon: Icon, labelKey, label }) => (
          <NavLink key={to} to={to} className={navLinkClass} onClick={onClose}>
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 tv:w-5 tv:h-5 shrink-0 ${isActive ? 'scale-110' : ''}`} />
                <span>{t(labelKey, label)}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Backend status indicator */}
        <div className="mt-3 px-3 py-2 flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isConnected ? 'bg-emerald-400' : 'bg-danger'
              }`}
            />
          </div>
          <span className="text-caption text-text-secondary">
            {backendStatus}
          </span>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/30 flex flex-col items-center gap-1 text-[10px] text-text-tertiary">
          <span>© {currentYear} Auto Clipper</span>
          <button
            onClick={() => window.open('https://auto-clipper.dhims.web.id', '_blank')}
            className="hover:text-gold transition-colors cursor-pointer"
          >
            Official Website
          </button>
        </div>
      </div>
    </aside>
  );
};
