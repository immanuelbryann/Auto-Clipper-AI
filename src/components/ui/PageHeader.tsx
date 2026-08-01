import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl tv:text-4xl font-bold text-gold-gradient">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm md:text-base text-text-secondary max-w-prose">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
