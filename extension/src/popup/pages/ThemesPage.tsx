import { useYtSettings } from '../YtSettingsContext';
import { ToggleRow } from '../components/ToggleRow';
import { ColorSwatches } from '../components/ColorSwatches';
import { getMessage } from '../i18n';
import { THEME_PRESETS, THEME_PRESET_GRADIENTS } from '@shared/ytSettings';

const PROGRESS = ['#ff0000', '#ff4444', '#ff8800', '#ffcc00', '#00ff00', '#00ffff', '#0088ff', '#7c3aed', '#ff66cc', '#ffffff'];
const BACKGROUNDS = ['#000000', '#0f0f0f', '#1a1a1a', '#252525', '#3a3a3a', '#111827', '#0c1a2e', '#1a0a0a', '#0a1a0a', '#1a0a1a'];
const PRIMARY = ['#ffffff', '#f5f5f5', '#cccccc', '#999999', '#00ffff', '#00ff00', '#ffff00', '#ffcc00', '#ff66cc', '#ff8800'];
const SECONDARY = ['#ffffff', '#e5e5e5', '#b3b3b3', '#888888', '#94a3b8', '#00ffff', '#a78bfa', '#f472b6'];
const HEADER = ['#000000', '#0f0f0f', '#1a1a1a', '#252525', '#111827', '#7f1d1d', '#14532d', '#1e3a8a', '#4c1d95'];
const ICONS = ['#ffffff', '#cccccc', '#999999', '#ff0000', '#00ffff', '#00ff00', '#ffff00', '#ff66cc'];
const MENU = ['#000000', '#0f0f0f', '#1a1a1a', '#252525', '#3a3a3a', '#111827'];
const LINE = ['#ff0000', '#ff4444', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#ffffff'];
const TIME = ['#ffffff', '#cccccc', '#ff0000', '#00ffff', '#00ff00', '#ffff00'];

const colorFields = [
  { key: 'progressbarColorPicker', label: 'Progressbar', colors: PROGRESS },
  { key: 'bgColorPicker', label: 'Background', colors: BACKGROUNDS },
  { key: 'primaryColorPicker', label: 'Primary', colors: PRIMARY },
  { key: 'secondaryColorPicker', label: 'Secondary', colors: SECONDARY },
  { key: 'headerColorPicker', label: 'Header', colors: HEADER },
  { key: 'iconsColorPicker', label: 'Icons', colors: ICONS },
  { key: 'menuColorPicker', label: 'Menu', colors: MENU },
  { key: 'lineColorPicker', label: 'Line preview', colors: LINE },
  { key: 'timeColorPicker', label: 'Time preview', colors: TIME },
] as const;

export function ThemesPage() {
  const { settings, loading, setField } = useYtSettings();
  if (loading) return <p className="text-sm text-white/50">…</p>;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{getMessage('themes.title')}</h2>
        <p className="mt-1 text-xs text-white/45">{getMessage('themes.desc')}</p>
      </div>

      <ToggleRow
        label={getMessage('opt.themes')}
        checked={settings.themes}
        onChange={(v) => setField('themes', v)}
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setField('theme', 'custom')}
          className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold ${
            settings.theme === 'custom' ? 'border-red-500 bg-red-600/20' : 'border-white/10 bg-white/5'
          }`}
        >
          {getMessage('themes.custom')}
        </button>
        <button
          type="button"
          onClick={() => setField('theme', '0')}
          className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold ${
            settings.theme !== 'custom' ? 'border-sky-500 bg-sky-600/20' : 'border-white/10 bg-white/5'
          }`}
        >
          {getMessage('themes.presets')}
        </button>
      </div>

      {settings.theme !== 'custom' && (
        <div className="space-y-2">
          {THEME_PRESETS.map((name, index) => {
            const key = String(index);
            const active = String(settings.theme) === key;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setField('theme', key)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm ${
                  active ? 'border-red-500 bg-red-600/15' : 'border-white/10 bg-white/5'
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-lg border border-white/20"
                  style={{ background: THEME_PRESET_GRADIENTS[key] || '#333' }}
                />
                <span className="flex-1 font-semibold">{name}</span>
                <i className={`fa-solid fa-circle text-xs ${active ? 'text-red-500' : 'text-white/20'}`} />
              </button>
            );
          })}
        </div>
      )}

      {settings.theme === 'custom' && (
        <div className="grid grid-cols-1 gap-2">
          {colorFields.map((field) => (
            <ColorSwatches
              key={field.key}
              label={field.label}
              colors={[...field.colors]}
              value={settings[field.key] || '#000000'}
              onChange={(c) => setField(field.key, c)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
