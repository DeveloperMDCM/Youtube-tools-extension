import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import { getLocale, getMessage } from './i18n';
import { YtSettingsProvider, useYtSettings } from './YtSettingsContext';
import { GeneralPage } from './pages/GeneralPage';
import { ThemesPage } from './pages/ThemesPage';
import { ButtonsPage } from './pages/ButtonsPage';
import { StatsPage } from './pages/StatsPage';
import { HeaderPage } from './pages/HeaderPage';
import { HomePage } from './pages/HomePage';
import { getExtensionVersion, USERSCRIPT_VERSION } from '@shared/versions';

const tabs = [
  { to: '/general', labelKey: 'tab.general', icon: 'fa-sliders' },
  { to: '/temas', labelKey: 'tab.themes', icon: 'fa-palette' },
  { to: '/buttons', labelKey: 'tab.buttons', icon: 'fa-puzzle-piece' },
  { to: '/stats', labelKey: 'tab.stats', icon: 'fa-chart-simple' },
  { to: '/headers', labelKey: 'tab.menu', icon: 'fa-swatchbook' },
] as const;

function Shell() {
  const { settings, loading } = useYtSettings();
  const [lang, setLang] = useState(getLocale());
  const [showLang, setShowLang] = useState(false);
  const [, bump] = useState(0);

  const menu = settings.menu_developermdcm;
  const shellStyle = {
    ['--popup-bg' as string]: menu.bg || '#0c0c0c',
    ['--popup-text' as string]: menu.color || '#ffffff',
    ['--popup-accent' as string]: menu.accent || '#ff0000',
  };

  if (loading) {
    return (
      <div className="popup-shell flex items-center justify-center text-white/50" style={shellStyle}>
        …
      </div>
    );
  }

  return (
    <div className="popup-shell text-[color:var(--popup-text)]" style={{ ...shellStyle, background: 'var(--popup-bg)' }}>
      {showLang && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
          <LanguageSelector
            selectedLanguage={lang}
            onSelectLanguage={(code) => {
              setLang(code);
              bump((n) => n + 1);
            }}
            onClose={() => setShowLang(false)}
          />
        </div>
      )}

      <header className="popup-header border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent px-3 pb-2.5 pt-3">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-2">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs text-white"
                style={{ background: 'var(--popup-accent)' }}
              >
                <i className="fa-brands fa-youtube" />
              </span>
              <h1 className="truncate text-base font-bold tracking-tight">{getMessage('app.title')}</h1>
            </div>
            <p className="truncate text-[11px] opacity-50">{getMessage('app.subtitle')}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-lg px-2 py-1.5 text-sm ${isActive ? 'bg-white/15' : 'opacity-60 hover:bg-white/10 hover:opacity-100'}`
              }
            >
              <i className="fa-solid fa-house" />
            </NavLink>
            <button
              type="button"
              className="rounded-lg px-2 py-1.5 text-sm opacity-60 hover:bg-white/10 hover:opacity-100"
              onClick={() => setShowLang(true)}
              title={getMessage('lan')}
            >
              <i className="fa-solid fa-globe" />
            </button>
          </div>
        </div>

        <nav className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center transition ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'bg-white/5 opacity-70 hover:bg-white/10 hover:opacity-100'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'var(--popup-accent)',
                      boxShadow: '0 8px 18px color-mix(in srgb, var(--popup-accent) 35%, transparent)',
                    }
                  : undefined
              }
            >
              <i className={`fa-solid ${tab.icon} text-xs`} />
              <span className="text-[9px] font-semibold leading-tight">{getMessage(tab.labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="popup-main px-3 py-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/general" element={<GeneralPage />} />
          <Route path="/temas" element={<ThemesPage />} />
          <Route path="/buttons" element={<ButtonsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/headers" element={<HeaderPage />} />
        </Routes>
      </main>

      <footer className="popup-footer border-t border-white/10 px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-center gap-2 text-[10px] opacity-45">
          <span>Ext v{getExtensionVersion()}</span>
          <span>·</span>
          <span>Script v{USERSCRIPT_VERSION}</span>
        </div>
        <a
          href="https://github.com/DeveloperMDCM"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-[11px] opacity-55 transition hover:opacity-100"
        >
          <i className="fa-brands fa-github text-sm" />
          DeveloperMDCM
        </a>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <YtSettingsProvider>
      <Shell />
    </YtSettingsProvider>
  );
}
