import { setLocale, getMessage } from '../i18n';
import { POPUP_LANGUAGES } from '../languages';

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  onClose,
}: {
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex max-h-[460px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ background: 'var(--popup-accent, #e11d1d)' }}
          >
            <i className="fa-solid fa-globe text-sm" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">{getMessage('lan')}</h3>
            <p className="text-[11px] text-white/45">{getMessage('lan.hint')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2.5 py-2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3">
        {POPUP_LANGUAGES.map((lang) => {
          const active = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onSelectLanguage(lang.code);
                setLocale(lang.code);
                onClose();
              }}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                active
                  ? 'border-[color:var(--popup-accent,#e11d1d)] bg-[color:var(--popup-accent,#e11d1d)]/20 text-white'
                  : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="text-sm font-semibold">{lang.native}</div>
              <div className="mt-0.5 text-[11px] opacity-55">{lang.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
