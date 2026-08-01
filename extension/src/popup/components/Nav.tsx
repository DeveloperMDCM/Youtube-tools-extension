import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { getLocale, getMessage } from '../i18n';

const tabs = [
  { to: '/general', label: 'General', icon: 'fa-shield-halved' },
  { to: '/temas', label: 'Themes', icon: 'fa-palette' },
  { to: '/stats', label: 'Stats', icon: 'fa-square-poll-vertical' },
  { to: '/headers', label: 'Header', icon: 'fa-newspaper' },
] as const;

export function Nav() {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(getLocale());
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-black">
      {showLanguageSelector && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-700/60">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            onClose={() => setShowLanguageSelector(false)}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h1 className="text-base font-bold text-white">Youtube Tools Extensión</h1>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl text-white hover:text-red-500" title="Home">
            <i className="fa-solid fa-house" />
          </Link>
          <button
            type="button"
            className="text-xl text-white hover:text-red-500"
            title={getMessage('lan')}
            onClick={() => setShowLanguageSelector(true)}
          >
            <i className="fa-solid fa-globe" />
          </button>
        </div>
      </div>

      <nav className="px-3 pb-3">
        <ul className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.to;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={`${
                    active ? 'bg-sky-500' : 'bg-red-600 hover:bg-sky-600'
                  } flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-white transition-colors`}
                >
                  <i className={`fa-solid ${tab.icon} text-lg`} />
                  <span className="text-[11px] font-semibold">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
