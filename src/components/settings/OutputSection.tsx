import React from 'react';
import { FolderOutput, FolderOpen, X } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { InputGroup } from '../ui/InputGroup';

interface OutputSectionProps {
  outputFolder: string;
  setOutputFolder: (folder: string) => void;
  quality: 'best' | '2160p' | '1440p' | '1080p' | '720p' | '480p';
  setQuality: (q: 'best' | '2160p' | '1440p' | '1080p' | '720p' | '480p') => void;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  outputFolder, setOutputFolder, quality, setQuality
}) => {
  const handleSelectFolder = async () => {
    if ('__TAURI_INTERNALS__' in window) {
      try {
        const { open } = await import('@tauri-apps/plugin-dialog');
        const folder = await open({ directory: true, multiple: false });
        if (folder) setOutputFolder(folder as string);
      } catch (err) {
        console.error(err);
      }
    }
    // In web mode: user can type the path manually
  };

  return (
    <div className="bg-bg-secondary rounded-card border border-border p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gold/10 rounded-lg text-gold">
          <FolderOutput className="w-5 h-5" />
        </div>
        <h2 className="text-section-title text-text-primary">Output</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-label text-text-secondary block mb-1.5">Folder Penyimpanan</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <InputGroup
                value={outputFolder || ''}
                placeholder="Default (temp_downloads)"
                onChange={(e) => setOutputFolder(e.target.value)}
              />
            </div>
            {'__TAURI_INTERNALS__' in window && (
              <Button variant="outline" icon={FolderOpen} onClick={handleSelectFolder}>
                Pilih
              </Button>
            )}
            {outputFolder && (
              <Button variant="ghost" size="sm" onClick={() => setOutputFolder('')} className="!px-2">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-caption text-text-tertiary mt-1.5">
            Folder tempat menyimpan hasil klip. Kosongkan untuk menggunakan folder default.
          </p>
        </div>

        <Select
          label="Kualitas Video Default (Download)"
          value={quality}
          onChange={(e) => setQuality(e.target.value as any)}
          options={[
            { label: 'Best (Otomatis) — Bawaan', value: 'best' },
            { label: '2160p (4K)', value: '2160p' },
            { label: '1440p (2K)', value: '1440p' },
            { label: '1080p', value: '1080p' },
            { label: '720p', value: '720p' },
            { label: '480p', value: '480p' },
          ]}
        />
      </div>
    </div>
  );
};
