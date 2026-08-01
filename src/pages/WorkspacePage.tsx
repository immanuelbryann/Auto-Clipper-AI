import React, { useContext } from 'react';
import { Film } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { AppContext } from '../App';
import GenerateForm from '../components/GenerateForm';
import ClipsResult from '../components/ClipsResult';
import { useTranslation } from 'react-i18next';

export const WorkspacePage: React.FC = () => {
  const ctx = useContext(AppContext);
  const hasClips = ctx.clips && ctx.clips.length > 0;
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title={t('aiClipper.title', 'AI Clipper')}
        subtitle={t('aiClipper.subtitle', 'Generate viral short clips dari video panjang secara otomatis.')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left: configuration */}
        <div className="lg:col-span-7 tv:col-span-6">
          <GenerateForm
            inputType={ctx.inputType}
            setInputType={ctx.setInputType}
            url={ctx.url}
            setUrl={ctx.setUrl}
            setLocalFile={ctx.setLocalFile}
            aspectRatio={ctx.aspectRatio}
            setAspectRatio={ctx.setAspectRatio}
            captionStyle={ctx.captionStyle}
            setCaptionStyle={ctx.setCaptionStyle}
            burnSubtitles={ctx.burnSubtitles}
            setBurnSubtitles={ctx.setBurnSubtitles}
            quality={ctx.quality}
            setQuality={ctx.setQuality}
            title={ctx.title}
            setTitle={ctx.setTitle}
            enableBroll={ctx.enableBroll}
            setEnableBroll={ctx.setEnableBroll}
            maxClips={ctx.maxClips}
            setMaxClips={ctx.setMaxClips}
            isGamingVideo={ctx.isGamingVideo}
            setIsGamingVideo={ctx.setIsGamingVideo}
            errorMsg={ctx.errorMsg}
            isRunning={ctx.isRunning}
            handleGenerate={ctx.handleGenerate}
          />
        </div>

        {/* Right: results */}
        <div className="lg:col-span-5 tv:col-span-6">
          {hasClips ? (
            <ClipsResult
              clips={ctx.clips}
              status={ctx.status}
              failedCount={ctx.failedCount}
              jobId={ctx.job?.id || ''}
              videoSrc={ctx.videoSrc}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-dashed border-border bg-bg-secondary/40 p-10 min-h-[360px] tv:min-h-[500px]">
              {/* Animated film icon */}
              <div className="relative">
                <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 animate-bounce-soft">
                  <Film className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 rounded-2xl border border-gold/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {t('main.empty_clips_title', 'Klip kamu muncul di sini')}
                </h3>
                <p className="text-caption text-text-secondary max-w-xs leading-relaxed">
                  {t('main.empty_clips_desc', 'Masukkan URL atau video lokal, atur format, lalu generate. Hasil klip AI beserta deskripsinya akan tampil di kolom ini.')}
                </p>
              </div>
              {/* Step hints */}
              <div className="flex flex-col gap-1.5 text-left text-[11px] text-text-tertiary">
                {['1. Masukkan URL YouTube atau file lokal', '2. Pilih aspect ratio (9:16 untuk Reels/TikTok)', '3. Klik Generate AI Clips'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
