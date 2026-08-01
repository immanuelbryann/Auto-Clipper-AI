import { Toast } from '../hooks/useToasts';

const kindStyles: Record<string, { bg: string; border: string; text: string }> = {
  error:   { bg: 'rgba(192,57,43,0.12)',  border: 'rgba(192,57,43,0.3)',   text: '#f87171' },
  success: { bg: 'rgba(39,174,96,0.12)',  border: 'rgba(39,174,96,0.3)',   text: '#34d399' },
  info:    { bg: 'rgba(41,128,185,0.12)', border: 'rgba(41,128,185,0.3)',  text: '#60a5fa' },
  warning: { bg: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.3)',  text: '#fbbf24' },
};

/** Fixed top-right stack of transient toast notifications. */
export default function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 1000,
        maxWidth: '340px',
        width: 'calc(100vw - 2rem)',
      }}
    >
      {toasts.map((t) => {
        const s = kindStyles[t.kind] || kindStyles.info;
        return (
          <div
            key={t.id}
            className="animate-slide-up"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              color: s.text,
              background: s.bg,
              border: `1px solid ${s.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            }}
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
}
