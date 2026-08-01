import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Check, RefreshCw, ShieldAlert } from 'lucide-react';
import { InputGroup } from '../ui/InputGroup';
import { Button } from '../ui/Button';
import axios from 'axios';

interface BackendSectionProps {
  backendUrl: string;
  onUpdateBackendUrl: (url: string) => void;
}

export const BackendSection: React.FC<BackendSectionProps> = ({
  backendUrl,
  onUpdateBackendUrl,
}) => {
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState(backendUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const handleSave = (urlToSave?: string) => {
    const target = (urlToSave !== undefined ? urlToSave : inputUrl).trim();
    onUpdateBackendUrl(target);
    setInputUrl(target);
    setTestStatus('idle');
    setTestMessage('');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');
    const target = inputUrl.trim().replace(/\/+$/, '');
    try {
      const res = await axios.get(`${target}/health`, { timeout: 4000 });
      if (res.status === 200) {
        setTestStatus('success');
        setTestMessage(t('settings.backend_connected', 'Koneksi ke backend Python berhasil!'));
      } else {
        setTestStatus('error');
        setTestMessage(t('settings.backend_failed', 'Backend merespons dengan status non-200.'));
      }
    } catch (err: any) {
      setTestStatus('error');
      if (isHttps && target.startsWith('http://')) {
        setTestMessage(
          'Browser memblokir permintaan HTTP dari situs HTTPS (Mixed Content). Silakan gunakan tunnel HTTPS (ngrok/cloudflare) atau jalankan frontend di localhost.'
        );
      } else {
        setTestMessage(
          err.message || 'Gagal terhubung ke backend. Pastikan server Python (main.py) sudah berjalan.'
        );
      }
    }
  };

  return (
    <div className="bg-bg-secondary rounded-card border border-border p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gold/10 rounded-lg text-gold">
          <Server className="w-5 h-5" />
        </div>
        <h2 className="text-section-title text-text-primary">Backend Server URL</h2>
      </div>

      <div className="space-y-5">
        {isHttps && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Penting untuk Deployment Web (Netlify/HTTPS)</span>
            </div>
            <p className="text-caption text-text-secondary leading-relaxed">
              Anda mengakses dari <strong>HTTPS Netlify</strong>. Browser memblokir koneksi otomatis ke <code>http://127.0.0.1:8000</code> lokal (Mixed Content restriction).
            </p>
            <div className="text-caption text-text-secondary space-y-1 pt-1">
              <p className="font-semibold text-text-primary">Pilihan Solusi:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong>Buka izin Mixed Content di browser</strong>: Klik ikon gembok di browser bar → Site Settings → <em>Insecure content</em> → Allow.
                </li>
                <li>
                  <strong>Gunakan HTTPS Tunnel</strong>: Jalankan <code>ngrok http 8000</code> di komputer Anda, lalu masukkan URL <code>https://...ngrok-free.app</code> pada input di bawah.
                </li>
                <li>
                  <strong>Jalankan Frontend Lokal</strong>: Jalankan <code>npm run dev</code> (http://localhost:5173) di komputer Anda untuk koneksi langsung tanpa masalah Mixed Content.
                </li>
              </ul>
            </div>
          </div>
        )}

        <div>
          <InputGroup
            label="URL Server Python Backend"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
            helperText="Alamat API server Python (misal: http://127.0.0.1:8000 atau URL tunnel https)"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="primary" size="sm" onClick={() => handleSave()} icon={Check}>
            Simpan URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            loading={testStatus === 'testing'}
            icon={RefreshCw}
          >
            {testStatus === 'testing' ? 'Mengecek...' : 'Tes Koneksi Server'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave('http://127.0.0.1:8000')}
          >
            Reset (127.0.0.1:8000)
          </Button>
        </div>

        {testStatus !== 'idle' && testMessage && (
          <p
            className={`text-sm mt-2 p-3 rounded-lg border ${
              testStatus === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-danger/10 border-danger/30 text-red-400'
            }`}
          >
            {testStatus === 'success' ? '✓ ' : '⚠️ '}
            {testMessage}
          </p>
        )}
      </div>
    </div>
  );
};
