import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Folder, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { API_URL } from '../App';
import { SocialKitModal } from './SocialKitModal';

export interface SocialData {
  titles_en?: string[];
  titles_id?: string[];
  description_en?: string;
  description_id?: string;
  hashtags_en?: string[];
  hashtags_id?: string[];
  thumbnail_layout?: string;
  best_time_to_post_en?: string;
  best_time_to_post_id?: string;
  backsound_en?: string;
  backsound_id?: string;
}

export interface Clip {
  path: string;
  description: string;
  description_en?: string;
  description_id?: string;
  start: string;
  end: string;
  subs: boolean;
  v: number;
  social?: SocialData;
}

interface ClipCardProps {
  clip: Clip;
  index: number;
  jobId: string;
  videoSrc: (path: string, v: number) => string;
}

export default function ClipCard({ clip, index, jobId, videoSrc }: ClipCardProps) {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [localSocial, setLocalSocial] = useState<SocialData | undefined>(clip.social);

  const currentDescription =
    i18n.language === 'id'
      ? clip.description_id || clip.description
      : clip.description_en || clip.description;

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const filename = clip.path.replace(/\\/g, '/').split('/').pop() || 'clip.mp4';

    // Tauri native save dialog (if in Tauri)
    if ('__TAURI_INTERNALS__' in window) {
      try {
        // Dynamic import so bundler doesn't fail in pure web
        const { save } = await import('@tauri-apps/plugin-dialog');
        const savePath = await save({
          defaultPath: filename,
          filters: [{ name: 'Video', extensions: ['mp4'] }],
        });
        if (savePath) {
          await fetch(`${API_URL}/save_file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src: clip.path, dest: savePath }),
          });
        }
        return;
      } catch (err) {
        console.error('Tauri save failed, falling back', err);
      }
    }

    // Web browser download fallback
    const a = document.createElement('a');
    a.href = videoSrc(clip.path, clip.v);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenFolder = async () => {
    const lastSlash = clip.path.replace(/\\/g, '/').lastIndexOf('/');
    const dir = clip.path.substring(0, lastSlash);

    try {
      await fetch(`${API_URL}/open_folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: dir }),
      });
    } catch (err) {
      console.error('Open folder failed', err);
      // Fallback if Tauri shell available
      if ('__TAURI_INTERNALS__' in window) {
        try {
          const { open } = await import('@tauri-apps/plugin-shell');
          await open(dir);
        } catch (e2) {
          console.error(e2);
        }
      }
    }
  };

  return (
    <div className="bg-bg-secondary rounded-card border border-border hover:border-gold/30 hover:shadow-card-hover transition-all duration-300 p-4 flex flex-col gap-4 w-72 tv:w-80 shrink-0 group">
      {/* Video preview */}
      <div className="aspect-[9/16] bg-scrim rounded-xl overflow-hidden border border-border/50 relative">
        <video
          key={clip.v}
          src={videoSrc(clip.path, clip.v)}
          controls
          playsInline
          className="w-full h-full object-contain bg-black"
        />
        {/* Clip number badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold/30">
          #{index + 1}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-3">
        <h3 className="text-sm font-bold text-text-primary group-hover:text-gold transition-colors">
          {t('clip.title_ai', { num: index + 1 })}
        </h3>
        <p className="text-caption text-text-secondary leading-relaxed flex-1">
          {currentDescription}
        </p>

        {/* Social Kit button */}
        {(currentDescription || localSocial) && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 py-2 px-3 bg-gold/10 text-gold rounded-lg text-caption font-semibold hover:bg-gold/20 transition-all cursor-pointer border border-gold/20 hover:border-gold/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('clip.social_kit', 'Social Kit')}
          </button>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#080808] rounded-button text-caption font-bold hover:shadow-gold-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t('clip.btn_download', 'Download')}
          </button>
          <Button
            variant="outline"
            size="sm"
            className="!px-3 shrink-0"
            title="Buka Folder"
            onClick={handleOpenFolder}
          >
            <Folder className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Social Kit Modal */}
      {(currentDescription || localSocial) && (
        <SocialKitModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          social={localSocial}
          clip={clip}
          jobId={jobId}
          clipIndex={index}
          onUpdate={(newSocial) => setLocalSocial(newSocial)}
        />
      )}
    </div>
  );
}
