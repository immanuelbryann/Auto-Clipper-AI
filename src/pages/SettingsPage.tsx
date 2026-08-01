import React, { useContext } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { AppContext } from '../App';
import { AppearanceSection } from '../components/settings/AppearanceSection';
import { ProviderSection } from '../components/settings/ProviderSection';
import { OutputSection } from '../components/settings/OutputSection';
import { UpdaterSection } from '../components/settings/UpdaterSection';

export const SettingsPage: React.FC = () => {
  const ctx = useContext(AppContext);

  return (
    <div className="p-4 md:p-6 lg:p-8 tv:p-12 max-w-[1800px] mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage application preferences & API keys"
      />
      <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-12">
        <AppearanceSection theme={ctx.theme} setTheme={ctx.setTheme} />
        <ProviderSection
          provider={ctx.provider}
          setProvider={ctx.setProvider}
          apiKeys={ctx.apiKeys}
          setApiKey={ctx.setApiKey}
        />
        <OutputSection
          outputFolder={ctx.outputFolder}
          setOutputFolder={ctx.setOutputFolder}
          quality={ctx.quality}
          setQuality={ctx.setQuality}
        />
        <UpdaterSection />
      </div>
    </div>
  );
};
