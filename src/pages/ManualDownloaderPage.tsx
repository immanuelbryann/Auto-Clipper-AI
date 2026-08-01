import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, Type, Folder, Download, Gamepad2 } from 'lucide-react';
import { SHOW_EXPERIMENTAL_FEATURES } from '../config/features';
import { PageHeader } from '../components/ui/PageHeader';
import { AppContext } from '../App';
import { InputGroup } from '../components/ui/InputGroup';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { Button } from '../components/ui/Button';

export const ManualDownloaderPage: React.FC = () => {
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadTitle, setDownloadTitle] = useState('');

  const handleDownload = () => {
    ctx.setTitle(downloadTitle);
    ctx.handleManualGenerate(downloadUrl, []);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title={t('manualDownloader.title', 'Manual Downloader')}
        subtitle={t('manualDownloader.subtitle', 'Download video penuh beserta subtitle otomatis')}
      />

      <div className="max-w-2xl mx-auto">
        <section className="bg-bg-secondary rounded-card border border-border shadow-card flex flex-col gap-0 overflow-hidden">
          <div className="p-5 md:p-6 tv:p-8 flex flex-col gap-5">

            {/* URL */}
            <InputGroup
              label={t('main.url_label', 'Video URL')}
              placeholder={t('main.url_placeholder', 'https://youtube.com/watch?...')}
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              icon={Link2}
            />

            {/* Title */}
            <InputGroup
              label={t('main.project_title_label', 'Judul Proyek (Opsional)')}
              placeholder={t('main.project_title_placeholder', 'Misal: Podcast Radit Full')}
              value={downloadTitle}
              onChange={(e) => setDownloadTitle(e.target.value)}
              icon={Folder}
            />

            {/* Aspect Ratio */}
            <div className="space-y-2.5">
              <label className="text-label text-text-secondary">
                {t('main.aspect_ratio_label', 'Video Aspect Ratio')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => ctx.setAspectRatio(ratio)}
                    className={[
                      'py-3 px-4 rounded-xl border transition-all duration-200 text-sm font-semibold',
                      ctx.aspectRatio === ratio
                        ? 'border-gold/60 bg-gold/10 text-gold shadow-gold-sm'
                        : 'border-border bg-bg-surface text-text-secondary hover:border-border-active hover:text-text-primary',
                    ].join(' ')}
                  >
                    {ratio === '9:16' ? '9:16 (Vertical)' : '16:9 (Landscape)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Options panel */}
            <div className="rounded-xl border border-border bg-bg-surface divide-y divide-border">
              {/* Burn subtitles */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold shrink-0">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      {t('main.burn_subtitles', 'Burn Subtitles')}
                    </h4>
                    <p className="text-caption text-text-secondary">
                      {t('main.burn_subtitles_desc', 'Embed captions directly into the video')}
                    </p>
                  </div>
                </div>
                <ToggleSwitch checked={ctx.burnSubtitles} onChange={ctx.setBurnSubtitles} />
              </div>

              {ctx.burnSubtitles && (
                <div className="p-4">
                  <label className="text-label text-text-secondary block mb-2.5">Subtitle Style</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['standard', 'karaoke'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => ctx.setCaptionStyle(style)}
                        className={[
                          'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200',
                          ctx.captionStyle === style
                            ? 'border-gold/60 bg-gold/10 text-gold'
                            : 'border-border bg-bg-elevated text-text-secondary hover:border-border-active',
                        ].join(' ')}
                      >
                        {style === 'standard' ? 'Standard (Baris)' : 'Karaoke (Word-by-word)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaming video — experimental */}
              {ctx.aspectRatio === '9:16' && SHOW_EXPERIMENTAL_FEATURES && (
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg text-gold shrink-0">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {t('main.gaming_video', 'Gaming Video')}
                      </h4>
                      <p className="text-caption text-text-secondary">
                        {t('main.gaming_video_desc', 'Auto-detect facecam streamer')}
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch checked={ctx.isGamingVideo} onChange={ctx.setIsGamingVideo} />
                </div>
              )}
            </div>

            {/* Error */}
            {ctx.errorMsg && (
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl text-sm text-red-400">
                ⚠️ {ctx.errorMsg}
              </div>
            )}

            {/* Download button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full !h-14 !font-black shadow-gold hover:shadow-gold"
              icon={Download}
              onClick={handleDownload}
              disabled={ctx.isRunning || !downloadUrl}
              loading={ctx.isRunning}
            >
              {ctx.isRunning
                ? t('main.probing', 'Memproses...')
                : t('manualDownloader.btn_download', 'Mulai Download')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
