import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/ui/PageHeader';
import { HelpCircle, BookOpen, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const HelpPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const faqs: { q: string; a: string }[] = t('help.faqs', { returnObjects: true }) as any;

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title={t('help.title', 'Help & Guide')}
        subtitle="Panduan penggunaan dan FAQ"
      />

      <div className="max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-bg-surface rounded-xl border border-border">
          {[
            { key: 'guide' as const, Icon: BookOpen, label: t('help.tab_guide', 'User Guide') },
            { key: 'faq'   as const, Icon: HelpCircle, label: t('help.tab_faq', 'FAQ') },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                activeTab === key
                  ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#080808] shadow-gold-sm'
                  : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'guide' ? (
            <div className="bg-bg-secondary rounded-card border border-border p-5 md:p-6 shadow-card space-y-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  {t('help.guide_title', 'How to Use')}
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {t('faq.desc')}
                </p>
              </div>

              <ol className="list-none flex flex-col gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex gap-4 items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-sm font-bold">
                      {n}
                    </div>
                    <div>
                      <strong className="text-text-primary text-sm font-semibold block mb-0.5">
                        {t(`faq.step${n}_title`)}
                      </strong>
                      <span className="text-text-secondary text-sm">{t(`faq.step${n}_desc`)}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="p-4 bg-danger/10 border-l-4 border-danger rounded-r-xl">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t('faq.note_title')}</span>
                </div>
                <p className="text-sm text-text-secondary m-0 leading-relaxed">
                  {t('faq.note_desc')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-text-primary">
                {t('help.faq_title', 'Frequently Asked Questions')}
              </h2>

              {Array.isArray(faqs) && faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={[
                      'bg-bg-secondary rounded-xl border transition-all duration-200 overflow-hidden',
                      isOpen ? 'border-gold/30 shadow-gold-sm' : 'border-border hover:border-border-active',
                    ].join(' ')}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 p-4 text-left"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-gold font-bold text-sm shrink-0 mt-0.5">Q:</span>
                        <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 animate-slide-up">
                        <div className="flex items-start gap-3 pl-0">
                          <span className="text-text-tertiary font-bold text-sm shrink-0">A:</span>
                          <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
