import { useYtSettings } from '../YtSettingsContext';
import { getMessage } from '../i18n';
import { ColorSwatches } from '../components/ColorSwatches';

const BG = ['#252525', '#1e1e1e', '#3a3a3a', '#4a4a4a', '#000000', '#2d2d2d', '#444444'];
const ACCENT = ['#ff0000', '#000000', '#009c37', '#0c02a0'];
const TITLE = ['#ffffff', '#cccccc', '#b3b3b3', '#00ffff', '#00ff00', '#ffff00', '#ffcc00', '#ff66cc'];

export function HeaderPage() {
  const { settings, loading, setMenuColor } = useYtSettings();
  if (loading) return <p className="text-sm text-white/50">…</p>;
  const menu = settings.menu_developermdcm;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{getMessage('menu.title')}</h2>
      <p className="mt-1 text-xs text-white/45">{getMessage('menu.desc')}</p>
      </div>
      <ColorSwatches label={getMessage('menu.bg')} colors={BG} value={menu.bg} onChange={(c) => setMenuColor('bg', c)} />
      <ColorSwatches
        label={getMessage('menu.accent')}
        colors={ACCENT}
        value={menu.accent}
        onChange={(c) => setMenuColor('accent', c)}
      />
      <ColorSwatches
        label={getMessage('menu.text')}
        colors={TITLE}
        value={menu.color}
        onChange={(c) => setMenuColor('color', c)}
      />
    </section>
  );
}
