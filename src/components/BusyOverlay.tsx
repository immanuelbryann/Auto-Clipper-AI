import { useContext, useEffect, useState } from 'react';
import { StopCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { Button } from './ui/Button';

export default function BusyOverlay() {
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [rotateIdx, setRotateIdx] = useState(0);

  useEffect(() => {
    if (!ctx?.isRunning) {
      setElapsedSeconds(0);
      setRotateIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [ctx?.isRunning]);

  useEffect(() => {
    if (ctx?.status === 'TRANSCRIBING') {
      const rot = setInterval(() => {
        setRotateIdx((prev) => (prev + 1) % 4);
      }, 4500);
      return () => clearInterval(rot);
    }
  }, [ctx?.status]);

  if (!ctx || !ctx.isRunning) return null;

  let displayPct = ctx.progressPct;
  if (ctx.status === 'TRANSCRIBING') {
    displayPct = Math.min(58, 45 + Math.floor(elapsedSeconds / 15));
  }

  const estimatedTotal = displayPct > 0 ? (elapsedSeconds * 100) / displayPct : 0;
  const estimatedRemaining = Math.max(0, Math.floor(estimatedTotal - elapsedSeconds));

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getStatusText = () => {
    if (elapsedSeconds > 2400) return t('busy.wait_40m', 'Harap tunggu, ternyata agak lama ya proses nya');
    if (elapsedSeconds > 1200) return t('busy.wait_20m', 'Sabar adalah kunci. Video kamu hampir siap!');
    if (elapsedSeconds > 600)  return t('busy.wait_10m', 'Sabar yaa, lagi proses nih...');
    if (ctx.status === 'TRANSCRIBING') {
      const messages = [
        t('busy.rotate_1', 'Mengekstrak audio video...'),
        t('busy.rotate_2', 'AI sedang membuat transkrip otomatis...'),
        t('busy.rotate_3', 'Menganalisis momen-momen terbaik...'),
        t('busy.rotate_4', 'Mengompresi hasil akhir...'),
      ];
      return messages[rotateIdx];
    }
    return ctx.progress || t('busy.preparing', 'Menyiapkan proses…');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-md glass-card rounded-card shadow-xl p-6 flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Spinning gold ring */}
          <div className="relative w-12 h-12 shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-bg-surface" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin"
              style={{ animationDuration: '0.8s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-text-primary">
              {t('busy.processing', 'Sedang memproses…')}
            </h3>
            <p className="text-caption text-text-secondary truncate mt-0.5">
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-caption font-medium">
            <span className="text-text-secondary">{t('busy.progress', 'Progress')}</span>
            <span className="text-gold font-bold">{displayPct}%</span>
          </div>
          {/* Gold progress bar */}
          <div className="w-full h-2.5 bg-bg-surface rounded-full overflow-hidden relative">
            <div
              className="h-full progress-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${displayPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-text-tertiary pt-0.5">
            <span>⏳ {formatTime(elapsedSeconds)}</span>
            <span>
              {displayPct > 0
                ? `~${formatTime(estimatedRemaining)} ${t('busy.remaining', 'tersisa')}`
                : t('busy.calculating', 'Menghitung...')}
            </span>
          </div>
        </div>

        {/* Warning */}
        <p className="text-[11px] text-text-tertiary leading-relaxed border-t border-border pt-4">
          {t('busy.warning', 'Mohon tunggu hingga proses selesai. Jangan tutup tab ini.')}
        </p>

        <Button variant="danger" icon={StopCircle} onClick={ctx.cancelJob} className="w-full">
          {t('busy.cancel', 'Batalkan Proses')}
        </Button>
      </div>
    </div>
  );
}
