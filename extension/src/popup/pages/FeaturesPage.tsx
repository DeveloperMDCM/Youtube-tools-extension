import { useSettings } from '../SettingsContext';

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="toggle-row">
      <div>
        <div className="toggle-label">{label}</div>
        {description ? <div className="toggle-desc">{description}</div> : null}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function FeaturesPage() {
  const { settings, loading, update } = useSettings();

  if (loading) return <p className="muted">Loading settings…</p>;

  return (
    <section className="stack">
      <Toggle
        label="Return dislikes"
        description="Show dislike counts on videos and Shorts"
        checked={settings.dislikes}
        onChange={(v) => update('dislikes', v)}
      />
      <Toggle
        label="Like / dislike bar"
        description="Ratio bar under the like button"
        checked={settings.likeDislikeBar}
        onChange={(v) => update('likeDislikeBar', v)}
      />
      <Toggle
        label="Download buttons"
        description="MP3 / MP4 controls under the player"
        checked={settings.downloadButtons}
        onChange={(v) => update('downloadButtons', v)}
      />
      <Toggle
        label="Comment translation"
        description="Translate buttons on comments"
        checked={settings.translation}
        onChange={(v) => update('translation', v)}
      />
      <Toggle
        label="Hide comments"
        checked={settings.hideComments}
        onChange={(v) => update('hideComments', v)}
      />
      <Toggle
        label="Hide sidebar"
        checked={settings.hideSidebar}
        onChange={(v) => update('hideSidebar', v)}
      />
      <Toggle
        label="Disable autoplay"
        checked={settings.disableAutoplay}
        onChange={(v) => update('disableAutoplay', v)}
      />
      <Toggle
        label="Disable subtitles"
        checked={settings.disableSubtitles}
        onChange={(v) => update('disableSubtitles', v)}
      />
      <Toggle
        label="Reverse layout"
        description="Swap primary / secondary columns"
        checked={settings.reverseMode}
        onChange={(v) => update('reverseMode', v)}
      />
    </section>
  );
}
