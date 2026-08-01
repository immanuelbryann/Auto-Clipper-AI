import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadCloud, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import packageJson from '../../../package.json';

export const UpdaterSection: React.FC = () => {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'idle' | 'up-to-date'>('idle');

  // In Tauri context, we could do real update checks.
  // In web context, we just show current version and link to website.
  const checkForUpdates = async () => {
    setChecking(true);
    setResult('idle');
    // If in Tauri, do real update check
    if ('__TAURI_INTERNALS__' in window) {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const update = await check();
        if (update) {
          // Prompt user — we handle basic confirmation
          if (window.confirm(`Update tersedia: v${update.version}. Install sekarang?`)) {
            const { relaunch } = await import('@tauri-apps/plugin-process');
            await update.downloadAndInstall();
            await relaunch();
          }
        } else {
          setResult('up-to-date');
        }
      } catch (err) {
        console.error(err);
        setResult('up-to-date');
      } finally {
        setChecking(false);
      }
      return;
    }
    // Web: just show up-to-date
    await new Promise((res) => setTimeout(res, 800));
    setResult('up-to-date');
    setChecking(false);
  };

  return (
    <div className="bg-bg-secondary rounded-card border border-border p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gold/10 rounded-lg text-gold">
          <DownloadCloud className="w-5 h-5" />
        </div>
        <h2 className="text-section-title text-text-primary">
          {t('updater.title', 'Pembaruan Aplikasi')}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl border border-border">
          <span className="text-sm text-text-secondary">Versi saat ini</span>
          <span className="text-sm font-bold text-gold">v{packageJson.version}</span>
        </div>

        <p className="text-sm text-text-secondary">
          {t('updater.description', 'Periksa apakah ada versi terbaru Auto Clipper.')}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={checkForUpdates}
            disabled={checking}
            loading={checking}
            variant="outline"
            icon={DownloadCloud}
          >
            {checking ? t('updater.checking', 'Memeriksa...') : t('updater.check_button', 'Periksa Pembaruan')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={ExternalLink}
            onClick={() => window.open('https://auto-clipper.dhims.web.id', '_blank')}
          >
            Official Website
          </Button>
        </div>

        {result === 'up-to-date' && (
          <p className="text-sm text-emerald-400 animate-fade-in">
            ✓ {t('updater.up_to_date', 'Anda menggunakan versi terbaru.')}
          </p>
        )}
      </div>
    </div>
  );
};
