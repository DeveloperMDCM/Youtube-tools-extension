import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { FlexContainer } from '../components/FlexContainer';
import { getMessage } from '../i18n';
import { extStorage, notifyYoutubeTabs } from '../storage';

type FeatureFlags = {
  FeatureDislikes: boolean;
  FeatureTranslation: boolean;
  FeatureHideComments: boolean;
  FeatureHideSidebar: boolean;
};

const defaults: FeatureFlags = {
  FeatureDislikes: true,
  FeatureTranslation: false,
  FeatureHideComments: false,
  FeatureHideSidebar: false,
};

export function SettingsPage() {
  const [flags, setFlags] = useState(defaults);

  useEffect(() => {
    extStorage.get<Partial<FeatureFlags>>(Object.keys(defaults), (result) => {
      setFlags({ ...defaults, ...result });
    });
  }, []);

  const toggle = (key: keyof FeatureFlags) => () => {
    setFlags((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      extStorage.set(next);
      // Mirror into userscript settings blob
      extStorage.get<{ ytSettingsMDCM?: string }>(['ytSettingsMDCM'], (data) => {
        let parsed: Record<string, unknown> = {};
        try {
          parsed = JSON.parse(data.ytSettingsMDCM || '{}');
        } catch {
          parsed = {};
        }
        const merged = {
          ...parsed,
          dislikes: next.FeatureDislikes,
          translation: next.FeatureTranslation,
          hideComments: next.FeatureHideComments,
          hideSidebar: next.FeatureHideSidebar,
        };
        extStorage.set({ ytSettingsMDCM: JSON.stringify(merged) });
        notifyYoutubeTabs({ message: 'YT_TOOLS_SETTINGS_UPDATED', settings: merged });
      });
      notifyYoutubeTabs({ message: 'ToggleFeatures', data: next });
      return next;
    });
  };

  return (
    <Card title={getMessage('setting')} description="Script features" info="Synced with YouTube content script">
      <FlexContainer
        checked={flags.FeatureDislikes}
        onChange={toggle('FeatureDislikes')}
        color="#22c55e"
        text={getMessage('feature.dislikes')}
      >
        <></>
      </FlexContainer>
      <FlexContainer
        checked={flags.FeatureTranslation}
        onChange={toggle('FeatureTranslation')}
        color="#38bdf8"
        text={getMessage('feature.translation')}
      >
        <></>
      </FlexContainer>
      <FlexContainer
        checked={flags.FeatureHideComments}
        onChange={toggle('FeatureHideComments')}
        color="#f97316"
        text="Hide comments"
      >
        <></>
      </FlexContainer>
      <FlexContainer
        checked={flags.FeatureHideSidebar}
        onChange={toggle('FeatureHideSidebar')}
        color="#a855f7"
        text="Hide sidebar"
      >
        <></>
      </FlexContainer>
    </Card>
  );
}
