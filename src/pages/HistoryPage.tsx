import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Trash2, RefreshCw, Wand2, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { AppContext, API_URL } from '../App';
import { canRerunAI, canResumeJob } from '../lib/history';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import ClipCard from '../components/ClipCard';
import { ManualResumeModal } from '../components/ManualResumeModal';

export const HistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const ctx = useContext(AppContext);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeRerenderId, setActiveRerenderId] = useState<string | null>(null);
  const [activeAiId, setActiveAiId] = useState<string | null>(null);
  const [activeManualJob, setActiveManualJob] = useState<any | null>(null);
  const [extraPrompt, setExtraPrompt] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const [localAspectRatio, setLocalAspectRatio] = useState('9:16');
  const [localCaptionStyle, setLocalCaptionStyle] = useState('standard');
  const [localBurnSubs, setLocalBurnSubs] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [ctx.historyVersion]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (jobId: string) => {
    if (window.confirm(t('history.delete_confirm', 'Hapus histori ini?'))) {
      try {
        await axios.delete(`${API_URL}/history/${jobId}`);
        fetchHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'completed' || status === 'DONE') return 'success';
    if (status === 'failed' || status === 'ERROR') return 'error';
    if (status === 'AWAITING_MANUAL') return 'gold';
    return 'neutral';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title="History"
        subtitle="View and manage generated clips"
        actions={
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchHistory} disabled={loading} loading={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />

      {loading && history.length === 0 ? (
        <div className="flex justify-center p-16">
          <div className="spinner" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center p-16 bg-bg-secondary rounded-card border border-border">
          <p className="text-text-secondary">{t('history.empty', 'Belum ada histori.')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-8">
          {history.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const hasClips = job.result_clips && job.result_clips.length > 0;

            return (
              <article
                key={job.id}
                className="bg-bg-secondary rounded-card border border-border shadow-card overflow-hidden transition-all duration-200 hover:border-border-active"
              >
                {/* Job header */}
                <div
                  className="flex items-start gap-3 p-4 md:p-5 cursor-pointer"
                  onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                >
                  <div className="flex-1 min-w-0">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-semibold text-text-primary hover:text-gold transition-colors truncate block"
                    >
                      {job.metadata?.title ? `${job.metadata.title}` : job.url}
                    </a>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-caption text-text-tertiary">
                        {new Date(job.created_at).toLocaleString()}
                      </span>
                      <span className="text-text-tertiary">·</span>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                      {job.metadata?.duration_seconds != null && (
                        <>
                          <span className="text-text-tertiary">·</span>
                          <span className="text-caption text-text-tertiary">
                            ⏱ {Math.floor(job.metadata.duration_seconds / 60)}m {job.metadata.duration_seconds % 60}s
                          </span>
                        </>
                      )}
                      {job.metadata?.quality && (
                        <>
                          <span className="text-text-tertiary">·</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gold/10 text-gold rounded-full border border-gold/20">
                            {job.metadata.quality}
                          </span>
                        </>
                      )}
                      {hasClips && (
                        <>
                          <span className="text-text-tertiary">·</span>
                          <Badge variant="gold">{job.result_clips.length} clips</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-danger !px-2"
                      onClick={(e) => { e.stopPropagation(); deleteHistory(job.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="text-text-tertiary">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expandable content */}
                {isExpanded && (
                  <div className="border-t border-border animate-slide-up">
                    {/* Clips scroll */}
                    {hasClips && (
                      <div className="flex gap-4 overflow-x-auto py-4 px-4 hide-scrollbar">
                        {job.result_clips.map((clip: any, idx: number) => (
                          <ClipCard
                            key={clip.path || idx}
                            clip={{ ...clip, description: clip.description || '', start: clip.start || '', end: clip.end || '', subs: clip.subs || false, v: Date.now() }}
                            index={idx}
                            jobId={job.id}
                            videoSrc={(path, v) => `${API_URL}/video?path=${encodeURIComponent(path)}&v=${v || 0}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Rerender Panel */}
                    {activeRerenderId === job.id && (
                      <div className="mx-4 mb-4 p-4 bg-bg-surface rounded-xl border border-border animate-slide-up">
                        <h4 className="text-sm font-semibold mb-4 text-text-primary">{t('history.rerender_options', 'Opsi Re-render')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <Select label={t('history.aspect_ratio', 'Aspect Ratio')} value={localAspectRatio} onChange={(e) => setLocalAspectRatio(e.target.value)}
                            options={[{ label: '9:16 (Vertical)', value: '9:16' }, { label: '16:9 (Landscape)', value: '16:9' }, { label: '4:5 (Portrait)', value: '4:5' }, { label: '1:1 (Square)', value: '1:1' }]}
                          />
                          <Select label={t('history.embed_subtitle', 'Embed Subtitle')} value={localBurnSubs ? 'yes' : 'no'} onChange={(e) => setLocalBurnSubs(e.target.value === 'yes')}
                            options={[{ label: t('history.sub_yes', 'Ya'), value: 'yes' }, { label: t('history.sub_no', 'Tidak'), value: 'no' }]}
                          />
                          {localBurnSubs && (
                            <Select label={t('history.caption_style', 'Caption Style')} value={localCaptionStyle} onChange={(e) => setLocalCaptionStyle(e.target.value)}
                              options={[{ label: t('history.style_standard', 'Standard'), value: 'standard' }, { label: t('history.style_karaoke', 'Karaoke'), value: 'karaoke' }]}
                            />
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={() => { ctx.handleRerender(job.id, localAspectRatio, localCaptionStyle, localBurnSubs); setActiveRerenderId(null); }}>
                            {t('history.start_rerender', 'Mulai Re-render')}
                          </Button>
                          <Button variant="ghost" onClick={() => setActiveRerenderId(null)}>{t('history.cancel', 'Batal')}</Button>
                        </div>
                      </div>
                    )}

                    {/* AI Correction Panel */}
                    {activeAiId === job.id && (
                      <div className="mx-4 mb-4 p-4 bg-bg-surface rounded-xl border border-border animate-slide-up">
                        <h4 className="text-sm font-semibold mb-1 text-text-primary">{t('history.ai_correct', 'AI Correction')}</h4>
                        <p className="text-caption text-text-secondary mb-4">{t('history.ai_correct_desc', 'Tambahkan instruksi tambahan untuk AI')}</p>
                        <textarea
                          value={extraPrompt}
                          onChange={(e) => setExtraPrompt(e.target.value)}
                          placeholder={t('history.ai_prompt_placeholder', 'Mis: Fokus pada momen lucu saja')}
                          className="w-full h-24 p-3 rounded-xl border border-border bg-input-bg text-text-primary text-sm mb-4 focus:outline-none focus:border-gold/60 focus:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] resize-none"
                        />
                        <div className="flex gap-3">
                          <Button onClick={() => { ctx.handleRerunAI(job.id, extraPrompt); setActiveAiId(null); setExtraPrompt(''); }}>
                            {t('history.run_ai', 'Jalankan AI')}
                          </Button>
                          <Button variant="ghost" onClick={() => setActiveAiId(null)}>{t('history.cancel', 'Batal')}</Button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2.5 p-4 pt-2 flex-wrap border-t border-border">
                      {hasClips && (
                        <Button variant={activeRerenderId === job.id ? 'primary' : 'outline'} size="sm" icon={RefreshCw}
                          onClick={() => setActiveRerenderId(activeRerenderId === job.id ? null : job.id)}
                        >
                          {t('history.rerender_btn', 'Re-render')}
                        </Button>
                      )}
                      {canRerunAI(job) && (
                        <Button variant={activeAiId === job.id ? 'primary' : 'outline'} size="sm" icon={Wand2}
                          onClick={() => setActiveAiId(activeAiId === job.id ? null : job.id)}
                        >
                          {t('history.ai_correct', 'AI Correction')}
                        </Button>
                      )}
                      {job.status === 'AWAITING_MANUAL' && (
                        <Button variant="primary" size="sm" icon={Play} onClick={() => setActiveManualJob(job)}>
                          {t('history.lanjut_manual', 'Lanjut Manual')}
                        </Button>
                      )}
                      {(job.status === 'failed' || job.status === 'ERROR') && canResumeJob(job) && (
                        <Button variant="outline" size="sm" icon={Play} className="!border-gold/40 !text-gold hover:!bg-gold/10"
                          onClick={() => ctx.handleResumeJob(job.id)}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {activeManualJob && (
        <ManualResumeModal
          job={activeManualJob}
          onClose={() => setActiveManualJob(null)}
          onSuccess={(jobId: string) => {
            setActiveManualJob(null);
            ctx.startManualResumePolling(jobId);
          }}
        />
      )}
    </div>
  );
};
