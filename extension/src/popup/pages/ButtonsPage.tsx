import { useYtSettings } from '../YtSettingsContext';
import { ToggleRow } from '../components/ToggleRow';
import { getMessage } from '../i18n';
import type { YtSettings } from '@shared/ytSettings';

const BUTTONS: Array<{ key: keyof YtSettings; labelKey: string }> = [
  { key: 'btnThumbnail', labelKey: 'btn.thumbnail' },
  { key: 'btnBuffer', labelKey: 'btn.buffer' },
  { key: 'btnFilterEyes', labelKey: 'btn.filterEyes' },
  { key: 'btnReset', labelKey: 'btn.reset' },
  { key: 'btnRepeat', labelKey: 'btn.repeat' },
  { key: 'btnBookmark', labelKey: 'btn.bookmark' },
  { key: 'btnContinueWatching', labelKey: 'btn.continue' },
  { key: 'btnTranscript', labelKey: 'btn.transcript' },
  { key: 'btnDownloadMp4', labelKey: 'btn.mp4' },
  { key: 'btnDownloadMp3', labelKey: 'btn.mp3' },
  { key: 'btnExternalDownload', labelKey: 'btn.external' },
  { key: 'btnViewExternal', labelKey: 'btn.viewExternal' },
  { key: 'btnPip', labelKey: 'btn.pip' },
  { key: 'btnScreenshot', labelKey: 'btn.screenshot' },
  { key: 'btnCheckUpdates', labelKey: 'btn.updates' },
];

export function ButtonsPage() {
  const { settings, loading, setField } = useYtSettings();
  if (loading) return <p className="text-sm text-white/50">…</p>;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{getMessage('buttons.title')}</h2>
        <p className="mt-1 text-xs text-white/45">{getMessage('buttons.desc')}</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {BUTTONS.map((b) => (
          <ToggleRow
            key={String(b.key)}
            label={getMessage(b.labelKey)}
            checked={settings[b.key] !== false}
            onChange={(v) => setField(b.key, v as never)}
          />
        ))}
      </div>
    </section>
  );
}
