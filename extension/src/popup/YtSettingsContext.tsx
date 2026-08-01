import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_YT_SETTINGS,
  YT_SETTINGS_KEY,
  parseYtSettings,
  type YtSettings,
} from '@shared/ytSettings';
import { extStorage, notifyYoutubeTabs } from './storage';

type Ctx = {
  settings: YtSettings;
  loading: boolean;
  setField: <K extends keyof YtSettings>(key: K, value: YtSettings[K]) => void;
  setMenuColor: (key: 'bg' | 'color' | 'accent', value: string) => void;
  replaceSettings: (next: YtSettings) => void;
};

const YtSettingsContext = createContext<Ctx | null>(null);

function persist(next: YtSettings) {
  const serialized = JSON.stringify(next);
  extStorage.set({ [YT_SETTINGS_KEY]: serialized });
  notifyYoutubeTabs({
    message: 'YT_TOOLS_SETTINGS_UPDATED',
    settings: next,
  });
}

export function YtSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<YtSettings>(DEFAULT_YT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extStorage.get<Record<string, unknown>>([YT_SETTINGS_KEY], (data) => {
      setSettings(parseYtSettings(data[YT_SETTINGS_KEY]));
      setLoading(false);
    });

    const onChange = (changes: Record<string, { newValue?: unknown }>) => {
      if (changes[YT_SETTINGS_KEY]) {
        setSettings(parseYtSettings(changes[YT_SETTINGS_KEY].newValue));
      }
    };
    extStorage.onChanged.addListener(onChange);
    return () => extStorage.onChanged.removeListener(onChange);
  }, []);

  const replaceSettings = useCallback((next: YtSettings) => {
    setSettings(next);
    persist(next);
  }, []);

  const setField = useCallback(
    <K extends keyof YtSettings>(key: K, value: YtSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        persist(next);
        return next;
      });
    },
    []
  );

  const setMenuColor = useCallback((key: 'bg' | 'color' | 'accent', value: string) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        menu_developermdcm: { ...prev.menu_developermdcm, [key]: value },
      };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, loading, setField, setMenuColor, replaceSettings }),
    [settings, loading, setField, setMenuColor, replaceSettings]
  );

  return <YtSettingsContext.Provider value={value}>{children}</YtSettingsContext.Provider>;
}

export function useYtSettings() {
  const ctx = useContext(YtSettingsContext);
  if (!ctx) throw new Error('useYtSettings must be used within YtSettingsProvider');
  return ctx;
}
