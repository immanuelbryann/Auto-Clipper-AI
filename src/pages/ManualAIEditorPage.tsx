import React, { useContext } from 'react';
import { Film } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { AppContext } from '../App';
import GenerateForm from '../components/GenerateForm';
import ClipsResult from '../components/ClipsResult';
import { useTranslation } from 'react-i18next';

export const ManualAIEditorPage: React.FC = () => {
  const ctx = useContext(AppContext);
  const hasClips = ctx.clips && ctx.clips.length > 0;
  const { t } = useTranslation();

  const handleManualGenerate = () => {
    ctx.handleGenerate('manual_ai');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title={t('manualAI.title', 'Manual AI Clipper')}
        subtitle={t('manualAI.subtitle', 'Generate prompt dari video untuk diproses AI secara manual')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        <div className="lg:col-span-7">
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
            handleGenerate={handleManualGenerate}
          />
        </div>

        <div className="lg:col-span-5">
          {hasClips ? (
            <ClipsResult
              clips={ctx.clips}
              status={ctx.status}
              failedCount={ctx.failedCount}
              jobId={ctx.jobId || ''}
              videoSrc={ctx.videoSrc}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-dashed border-border bg-bg-secondary/40 p-10 min-h-[360px]">
              <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 animate-bounce-soft">
                <Film className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {t('main.empty_clips_title', 'Klip kamu muncul di sini')}
                </h3>
                <p className="text-caption text-text-secondary max-w-xs leading-relaxed">
                  {t('main.empty_clips_desc', 'Masukkan URL atau video lokal, atur format, lalu generate.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
