import { Dispatch, SetStateAction, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL, AppContext } from '../App';
import { SHOW_EXPERIMENTAL_FEATURES } from '../config/features';
import { useTranslation } from 'react-i18next';
import {
  Link2, FileVideo, Wand2, Type, Folder, Film, RefreshCw, ChevronDown,
} from 'lucide-react';
import { InputGroup } from './ui/InputGroup';
import { Select } from './ui/Select';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { Button } from './ui/Button';

type Quality = 'best' | '2160p' | '1440p' | '1080p' | '720p' | '480p';

interface GenerateFormProps {
  inputType: 'url' | 'local';
  setInputType: Dispatch<SetStateAction<'url' | 'local'>>;
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  setLocalFile: Dispatch<SetStateAction<File | null>>;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  setAspectRatio: Dispatch<SetStateAction<'1:1' | '4:5' | '9:16' | '16:9'>>;
  captionStyle: 'standard' | 'karaoke';
  setCaptionStyle: Dispatch<SetStateAction<'standard' | 'karaoke'>>;
  burnSubtitles: boolean;
  setBurnSubtitles: Dispatch<SetStateAction<boolean>>;
  quality: Quality;
  setQuality: Dispatch<SetStateAction<Quality>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  enableBroll: boolean;
  setEnableBroll: Dispatch<SetStateAction<boolean>>;
  maxClips: number;
  setMaxClips: Dispatch<SetStateAction<number>>;
  isGamingVideo: boolean;
  setIsGamingVideo: Dispatch<SetStateAction<boolean>>;
  errorMsg: string;
  isRunning: boolean;
  handleGenerate: () => void;
}

const aspectRatios = [
  {
    value: '9:16' as const,
    label: '9:16',
    sublabel: 'Vertical',
    w: 14, h: 24,
  },
  {
    value: '16:9' as const,
    label: '16:9',
    sublabel: 'Landscape',
    w: 24, h: 14,
  },
  {
    value: '4:5' as const,
    label: '4:5',
    sublabel: 'Portrait',
    w: 18, h: 22,
  },
  {
    value: '1:1' as const,
    label: '1:1',
    sublabel: 'Square',
    w: 20, h: 20,
  },
];

export default function GenerateForm({
  inputType, setInputType, url, setUrl, setLocalFile,
  aspectRatio, setAspectRatio, captionStyle, setCaptionStyle,
  burnSubtitles, setBurnSubtitles, quality, setQuality,
  title, setTitle, enableBroll, setEnableBroll,
  maxClips, setMaxClips, isGamingVideo, setIsGamingVideo,
  errorMsg, isRunning, handleGenerate,
}: GenerateFormProps) {
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const [availHeights, setAvailHeights] = useState<number[]>([]);
  const [probing, setProbing] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const probeQualities = async () => {
    if (!url) return;
    setProbing(true);
    try {
      const r = await axios.get(`${API_URL}/probe`, { params: { url } });
      setAvailHeights(r.data.heights || []);
    } catch {
      setAvailHeights([]);
    } finally {
      setProbing(false);
    }
  };

  return (
    <section className="bg-bg-secondary rounded-card border border-border shadow-card flex flex-col gap-0 overflow-hidden">
      {/* Input type tabs */}
      <div className="flex border-b border-border">
        {[
          { key: 'url', label: 'URL Video', Icon: Link2 },
          { key: 'local', label: 'Local Video', Icon: FileVideo },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setInputType(key as 'url' | 'local')}
            className={[
              'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200',
              'tv:py-5 tv:text-base',
              inputType === key
                ? 'bg-gold/10 text-gold border-b-2 border-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface border-b-2 border-transparent',
            ].join(' ')}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6 tv:p-8 flex flex-col gap-5">
        {/* Input field */}
        <div>
          {inputType === 'url' ? (
            <div className="space-y-3">
              <InputGroup
                label={t('main.url_label', 'Video URL')}
                placeholder={t('main.url_placeholder', 'https://youtube.com/watch?...')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                icon={Link2}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={probeQualities}
                  disabled={!url || probing}
                  loading={probing}
                >
                  {probing ? t('main.probing', 'Mengecek...') : t('main.probe_btn', 'Cek kualitas tersedia')}
                </Button>
                {availHeights.length > 0 && (
                  <span className="text-caption text-gold/80 font-medium">
                    {t('main.probe_avail', 'Tersedia:')} {availHeights.map((h) => `${h}p`).join(', ')}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-label text-text-secondary">
                {t('main.local_file_label', 'Select Local Video File')}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={(e) => setLocalFile(e.target.files?.[0] || null)}
                  className={[
                    'w-full py-2.5 px-4 rounded-input border border-border bg-input-bg text-text-primary',
                    'file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0',
                    'file:bg-gold/10 file:text-gold file:text-sm file:font-medium file:cursor-pointer',
                    'hover:file:bg-gold/20 file:transition-colors',
                    'focus:outline-none focus:border-gold/60',
                  ].join(' ')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Project title */}
        <InputGroup
          label={t('main.project_title_label', 'Judul Proyek (Opsional)')}
          placeholder={t('main.project_title_placeholder', 'Misal: Podcast Radit')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={Folder}
          helperText={t('main.project_title_desc', 'Digunakan untuk nama folder output.')}
        />

        {/* Aspect Ratio */}
        <div className="space-y-2.5">
          <label className="text-label text-text-secondary">
            {t('main.aspect_ratio_label', 'Video Aspect Ratio')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {aspectRatios.map(({ value, label, sublabel, w, h }) => {
              const isSelected = aspectRatio === value;
              return (
                <button
                  key={value}
                  onClick={() => setAspectRatio(value)}
                  className={[
                    'py-3 px-2 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    'tv:py-4 tv:px-3',
                    isSelected
                      ? 'border-gold/60 bg-gold/10 shadow-gold-sm'
                      : 'border-border bg-bg-surface hover:border-border-active',
                  ].join(' ')}
                >
                  <div
                    className={`rounded-sm border-2 ${isSelected ? 'border-gold' : 'border-text-tertiary'}`}
                    style={{ width: w, height: h }}
                  />
                  <div className="text-center">
                    <div className={`text-sm font-bold ${isSelected ? 'text-gold' : 'text-text-primary'}`}>
                      {label}
                    </div>
                    <div className="text-[10px] text-text-tertiary">{sublabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options panel */}
        <div className="rounded-xl border border-border bg-bg-surface divide-y divide-border">
          {/* Burn Subtitles */}
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
            <ToggleSwitch checked={burnSubtitles} onChange={setBurnSubtitles} />
          </div>

          {burnSubtitles && (
            <div className="p-4">
              <label className="text-label text-text-secondary block mb-2.5">
                {t('main.subtitle_style_label', 'Subtitle Style')}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['standard', 'karaoke'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setCaptionStyle(style)}
                    className={[
                      'py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200',
                      captionStyle === style
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-border bg-bg-elevated text-text-secondary hover:border-border-active hover:text-text-primary',
                    ].join(' ')}
                  >
                    {style === 'standard' ? 'Standard (Baris)' : 'Karaoke (Word-by-word)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* B-Roll */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg text-gold shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {t('main.dynamic_broll', 'Dynamic B-Roll')}
                </h4>
                <p className="text-caption text-text-secondary">
                  {t('main.dynamic_broll_desc', 'Otomatis tambahkan video ilustrasi (Pexels API)')}
                </p>
              </div>
            </div>
            <ToggleSwitch checked={enableBroll} onChange={setEnableBroll} />
          </div>

          {/* Gaming toggle — experimental */}
          {SHOW_EXPERIMENTAL_FEATURES && (
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg text-gold shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    {t('main.gaming_video', 'Gaming Video')}
                  </h4>
                  <p className="text-caption text-text-secondary">
                    {t('main.gaming_video_desc', 'Auto-deteksi facecam streamer')}
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={isGamingVideo} onChange={setIsGamingVideo} />
            </div>
          )}
        </div>

        {/* Advanced options — collapsible */}
        <div className="rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
          >
            <span>{t('main.advanced_options', 'Opsi Lanjutan')}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {advancedOpen && (
            <div className="p-4 border-t border-border flex flex-col gap-4 animate-slide-up bg-bg-surface">
              {inputType === 'url' && (
                <Select
                  label={t('main.video_quality_label', 'Kualitas Video (Download)')}
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as Quality)}
                  options={
                    availHeights.length > 0
                      ? [
                          { label: t('main.quality_best', 'Best (Otomatis)'), value: 'best' },
                          ...availHeights.map((h) => {
                            let label = `${h}p`;
                            if (h >= 2160) label = '2160p (4K)';
                            else if (h >= 1440) label = '1440p (2K)';
                            return { label, value: `${h}p` };
                          }),
                        ]
                      : [
                          { label: t('main.quality_best', 'Best (Otomatis)'), value: 'best' },
                          { label: '2160p (4K)', value: '2160p' },
                          { label: '1440p (2K)', value: '1440p' },
                          { label: '1080p', value: '1080p' },
                          { label: '720p', value: '720p' },
                          { label: '480p', value: '480p' },
                        ]
                  }
                />
              )}

              <Select
                label={t('main.max_clips_label', 'Max Clips (Batas Klip)')}
                value={maxClips.toString()}
                onChange={(e) => setMaxClips(Number(e.target.value))}
                options={[
                  { label: t('main.max_clips_auto', 'Auto (Sesuai Durasi)'), value: '0' },
                  { label: '3',  value: '3' },
                  { label: '5',  value: '5' },
                  { label: '10', value: '10' },
                  { label: '15', value: '15' },
                  { label: '20', value: '20' },
                ]}
              />
            </div>
          )}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
            <div className="text-sm text-red-400">⚠️ {errorMsg}</div>
            {ctx.status === 'ERROR' && ctx.jobId && (
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                className="whitespace-nowrap !border-danger/40 !text-red-400 hover:!bg-danger/10"
                onClick={() => ctx.handleResumeJob(ctx.jobId)}
              >
                Retry
              </Button>
            )}
          </div>
        )}

        {/* Generate button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full !h-14 !text-base !font-black tracking-wide shadow-gold hover:shadow-gold animate-glow"
          icon={Wand2}
          onClick={handleGenerate}
          disabled={isRunning}
          loading={isRunning}
        >
          {isRunning ? t('busy.processing', 'Memproses...') : t('main.btn_generate', 'Generate AI Clips')}
        </Button>
      </div>
    </section>
  );
}
