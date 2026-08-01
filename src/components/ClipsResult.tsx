import ClipCard, { Clip } from './ClipCard';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../App';
import { useTranslation } from 'react-i18next';

interface ClipsResultProps {
  clips: Clip[];
  status: string;
  failedCount: number;
  jobId: string;
  videoSrc: (p: string, v?: number) => string;
}

export default function ClipsResult({ clips, status, failedCount, jobId, videoSrc }: ClipsResultProps) {
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const isDone = status === 'DONE';

  if (clips.length === 0) return null;

  return (
    <section className="animate-slide-up flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-gold animate-spin shrink-0" />
          )}
          <h2 className="text-base font-bold text-text-primary">
            {isDone ? 'Generated Clips' : 'Generating Clips...'}
          </h2>
        </div>

        {isDone && (
          <Badge variant="success">
            {clips.length} clip{clips.length > 1 ? 's' : ''}
          </Badge>
        )}
        {failedCount > 0 && (
          <Badge variant="error">{failedCount} failed</Badge>
        )}

        {(isDone || status === 'ERROR') && (
          <div className="ml-auto">
            <Button variant="outline" size="sm" icon={Plus} onClick={ctx.handleResetWorkspace}>
              {t('main.btn_new_clip', 'Buat Klip Baru')}
            </Button>
          </div>
        )}
      </div>

      {/* Scrollable clips row */}
      <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
        {clips.map((clip, i) => (
          <ClipCard
            key={clip.path}
            clip={clip}
            index={i}
            jobId={jobId}
            videoSrc={videoSrc}
          />
        ))}
      </div>
    </section>
  );
}
