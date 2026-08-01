import { useMemo, useRef, useState } from 'react';
import { getMessage } from '../i18n';
import { useYtSettings } from '../YtSettingsContext';
import {
  GITHUB_URL,
  SHARE_URL,
  USERSCRIPT_VERSION,
  getExtensionVersion,
} from '@shared/versions';
import {
  CONFIG_FILE_EXT,
  downloadConfigFile,
  parseConfigImport,
  readConfigFile,
  serializeConfigBundle,
} from '@shared/configIO';
import { isExtensionRuntime } from '../storage';

function shareLinks(url: string) {
  const u = encodeURIComponent(url);
  return [
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: 'fa-facebook' },
    { id: 'twitter', label: 'X / Twitter', href: `https://twitter.com/intent/tweet?url=${u}`, icon: 'fa-twitter' },
    { id: 'whatsapp', label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${u}`, icon: 'fa-whatsapp' },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: 'fa-linkedin' },
  ];
}

export function HomePage() {
  const { settings, replaceSettings } = useYtSettings();
  const [pasteText, setPasteText] = useState('');
  const [status, setStatus] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const extVersion = useMemo(() => getExtensionVersion(), []);
  const links = useMemo(() => shareLinks(SHARE_URL), []);

  const applyImport = (result: ReturnType<typeof parseConfigImport>) => {
    if (!result.ok) {
      if (result.error === 'invalid_magic') setStatus(getMessage('config.badMagic'));
      else if (result.error === 'empty') setStatus(getMessage('config.empty'));
      else setStatus(getMessage('config.invalid'));
      return;
    }
    replaceSettings(result.settings);
    setStatus(getMessage('config.imported'));
    setPasteText('');
    setShowPaste(false);
  };

  const exportFile = () => {
    downloadConfigFile(settings);
    setStatus(getMessage('config.downloaded'));
  };

  const copyConfig = async () => {
    const json = serializeConfigBundle(settings);
    setPasteText(json);
    setShowPaste(true);
    try {
      await navigator.clipboard.writeText(json);
      setStatus(getMessage('config.exported'));
    } catch {
      setStatus(getMessage('config.ready'));
    }
  };

  const importFromPaste = () => applyImport(parseConfigImport(pasteText));

  const onPickFile = async (file: File | null) => {
    if (!file) return;
    const result = await readConfigFile(file);
    applyImport(result);
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setStatus(getMessage('share.copied'));
    } catch {
      setStatus(SHARE_URL);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5">
        <h2 className="text-xl font-bold tracking-tight">{getMessage('home.welcome')}</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-70">{getMessage('home.hint')}</p>
        <p className="mt-2 text-xs leading-relaxed opacity-50">{getMessage('home.features')}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide opacity-45">
            {getMessage('home.extVersion')}
          </div>
          <div className="mt-1 text-lg font-bold" style={{ color: 'var(--popup-accent)' }}>
            v{extVersion}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide opacity-45">
            {getMessage('home.scriptVersion')}
          </div>
          <div className="mt-1 text-lg font-bold" style={{ color: 'var(--popup-accent)' }}>
            v{USERSCRIPT_VERSION}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setShowShare((v) => !v);
            setShowConfig(false);
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold hover:bg-white/10"
        >
          <i className="fa-solid fa-share-nodes" style={{ color: 'var(--popup-accent)' }} />
          {getMessage('share.title')}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowConfig((v) => !v);
            setShowShare(false);
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold hover:bg-white/10"
        >
          <i className="fa-solid fa-file-import" style={{ color: 'var(--popup-accent)' }} />
          {getMessage('config.title')}
        </button>
      </div>

      {showShare && (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs opacity-55">{getMessage('share.desc')}</p>
          <div className="grid grid-cols-2 gap-2">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-semibold hover:bg-white/10"
              >
                <i className={`fa-brands ${l.icon}`} />
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={SHARE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-white"
              style={{ background: 'var(--popup-accent)' }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
              GreasyFork
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-semibold hover:bg-white/10"
            >
              <i className="fa-brands fa-github" />
              GitHub
            </a>
          </div>
          <button
            type="button"
            onClick={copyShare}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-semibold hover:bg-white/10"
          >
            <i className="fa-solid fa-copy mr-2" />
            {getMessage('share.copy')}
          </button>
        </div>
      )}

      {showConfig && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs opacity-55">{getMessage('config.desc')}</p>
          <p className="text-[11px] opacity-40">
            {getMessage('config.formatHint').replace('{ext}', CONFIG_FILE_EXT)}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={exportFile}
              className="rounded-xl px-3 py-2.5 text-xs font-bold text-white"
              style={{ background: 'var(--popup-accent)' }}
            >
              <i className="fa-solid fa-download mr-1.5" />
              {getMessage('config.download')}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs font-semibold hover:bg-white/10"
            >
              <i className="fa-solid fa-upload mr-1.5" />
              {getMessage('config.upload')}
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept={`${CONFIG_FILE_EXT},.json,.txt,application/json`}
            className="hidden"
            onChange={(e) => {
              void onPickFile(e.target.files?.[0] || null);
              e.target.value = '';
            }}
          />

          <button
            type="button"
            onClick={() => {
              setShowPaste((v) => !v);
              if (!pasteText) setPasteText(serializeConfigBundle(settings));
            }}
            className="w-full rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-2 text-[11px] font-semibold opacity-80 hover:bg-white/10"
          >
            {showPaste ? getMessage('config.hidePaste') : getMessage('config.showPaste')}
          </button>

          {showPaste && (
            <div className="space-y-2">
              <textarea
                className="h-32 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-[11px] outline-none focus:border-[color:var(--popup-accent)]"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                spellCheck={false}
                placeholder={getMessage('config.pastePlaceholder')}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyConfig}
                  className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-semibold hover:bg-white/10"
                >
                  {getMessage('config.copy')}
                </button>
                <button
                  type="button"
                  onClick={importFromPaste}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-white"
                  style={{ background: 'var(--popup-accent)' }}
                >
                  {getMessage('config.importPaste')}
                </button>
              </div>
              <p className="text-[10px] leading-relaxed opacity-40">{getMessage('config.safeHint')}</p>
            </div>
          )}
        </div>
      )}

      {status ? <p className="text-center text-[11px] opacity-60">{status}</p> : null}

      <p className="text-center text-[11px] opacity-35">
        {isExtensionRuntime() ? getMessage('home.runtimeExt') : getMessage('home.runtimePreview')}
      </p>
    </section>
  );
}
