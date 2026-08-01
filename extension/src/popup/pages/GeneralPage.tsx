import { useYtSettings } from '../YtSettingsContext';
import { FieldBlock, ToggleRow } from '../components/ToggleRow';
import { getMessage } from '../i18n';
import {
  COMMENT_LANGUAGES,
  QUALITY_OPTIONS,
  WAVE_OPTIONS,
} from '@shared/ytSettings';

export function GeneralPage() {
  const { settings, loading, setField } = useYtSettings();
  if (loading) return <p className="text-sm text-white/50">…</p>;

  const toggles: Array<{ key: keyof typeof settings; label: string }> = [
    { key: 'hideComments', label: getMessage('opt.hideComments') },
    { key: 'hideSidebar', label: getMessage('opt.hideSidebar') },
    { key: 'disableAutoplay', label: getMessage('opt.disableAutoplay') },
    { key: 'disableSubtitles', label: getMessage('opt.disableSubtitles') },
    { key: 'dislikes', label: getMessage('opt.dislikes') },
    { key: 'likeDislikeBar', label: getMessage('opt.likeBar') },
    { key: 'bookmarks', label: getMessage('opt.bookmarks') },
    { key: 'continueWatching', label: getMessage('opt.continueWatching') },
    { key: 'shortsChannelName', label: getMessage('opt.shortsChannel') },
    { key: 'themes', label: getMessage('opt.themes') },
    { key: 'translation', label: getMessage('opt.translation') },
    { key: 'avatars', label: getMessage('opt.avatars') },
    { key: 'reverseMode', label: getMessage('opt.reverse') },
    { key: 'cinematicLighting', label: getMessage('opt.cinematic') },
    { key: 'waveVisualizer', label: getMessage('opt.wave') },
    { key: 'syncCinematic', label: getMessage('opt.syncCinematic') },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{getMessage('general.title')}</h2>
        <p className="mt-1 text-xs text-white/45">{getMessage('general.desc')}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {toggles.map((t) => (
          <ToggleRow
            key={String(t.key)}
            label={t.label}
            checked={Boolean(settings[t.key])}
            onChange={(v) => setField(t.key, v as never)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FieldBlock label={getMessage('opt.waveEffect')}>
          <select
            className="yt-select w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
            value={settings.waveVisualizerSelected}
            onChange={(e) => setField('waveVisualizerSelected', e.target.value)}
          >
            {WAVE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label={getMessage('opt.quality')}>
          <select
            className="yt-select w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
            value={settings.selectVideoQuality}
            onChange={(e) => setField('selectVideoQuality', e.target.value)}
          >
            {QUALITY_OPTIONS.map((o) => (
              <option key={o.label + o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label={getMessage('opt.translateLang')}>
          <select
            className="yt-select w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
            value={settings.languagesComments}
            onChange={(e) => setField('languagesComments', e.target.value)}
          >
            {Object.entries(COMMENT_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label={`${getMessage('opt.playerSize')}: ${settings.playerSize}%`}>
          <input
            type="range"
            min={50}
            max={150}
            className="yt-range"
            value={Number(settings.playerSize) || 100}
            onChange={(e) => setField('playerSize', Number(e.target.value))}
          />
          <button
            type="button"
            className="mt-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
            style={{ borderColor: 'color-mix(in srgb, var(--popup-accent) 40%, transparent)' }}
            onClick={() => setField('playerSize', 100)}
          >
            {getMessage('opt.resetSize')}
          </button>
        </FieldBlock>
      </div>
    </section>
  );
}
