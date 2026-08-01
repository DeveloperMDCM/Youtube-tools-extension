import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ExtensionSettings } from '@shared/defaults';
import { DEFAULT_SETTINGS } from '@shared/defaults';
import { loadSettings, saveSettings } from '@shared/storage';
import { sendToActiveTab } from '@shared/browser';

type SettingsContextValue = {
  settings: ExtensionSettings;
  loading: boolean;
  update: <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    loadSettings().then((s) => {
      if (!alive) return;
      setSettings(s);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(async (next: ExtensionSettings) => {
    setSettings(next);
    await saveSettings(next);
    await sendToActiveTab({ type: 'YT_TOOLS_SETTINGS_UPDATED', settings: next });
  }, []);

  const update = useCallback(
    <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => {
      void persist({ ...settings, [key]: value });
    },
    [persist, settings]
  );

  const reset = useCallback(() => {
    void persist({ ...DEFAULT_SETTINGS });
  }, [persist]);

  const value = useMemo(
    () => ({ settings, loading, update, reset }),
    [settings, loading, update, reset]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
