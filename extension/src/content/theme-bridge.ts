/** Applies popup color/theme settings (legacy extension keys) on YouTube */

const generalKeys = [
  'GeneralIsActivePrimaryColor',
  'GeneralPrimaryColor',
  'GeneralIsActiveSecondaryColor',
  'GeneralSecondaryColor',
  'GeneralIsActiveIconColor',
  'GeneralIconColor',
  'GeneralIsActiveLineVideoColor',
  'GeneralLineVideoColor',
  'GeneralIsActiveTimeVideoColor',
  'GeneralTimeVideoColor',
  'GeneralIsActiveHeaderColor',
  'GeneralHeaderColor',
  'GeneralIsActiveMenuColor',
  'GeneralMenuColor',
];

function applyCssVar(active: boolean, value: string, property: string) {
  if (active && value) {
    document.documentElement.style.setProperty(property, value);
  } else {
    document.documentElement.style.removeProperty(property);
  }
}

function applyGeneral(result: Record<string, unknown>) {
  const css = `
    :root {
      --primary-color-text: ${result.GeneralPrimaryColor || ''};
      --secondary-color: ${result.GeneralSecondaryColor || ''};
      --icons-color: ${result.GeneralIconColor || ''};
      --line-color-preview: ${result.GeneralLineVideoColor || ''};
      --time-color-preview: ${result.GeneralTimeVideoColor || ''};
      --header-color: ${result.GeneralHeaderColor || ''};
      --menu-color: ${result.GeneralMenuColor || ''};
    }
    ${
      result.GeneralIsActiveHeaderColor
        ? `#background.ytd-masthead { background-color: ${result.GeneralHeaderColor} !important; }`
        : ''
    }
  `;

  let el = document.getElementById('yt-tools-ext-general-style') as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = 'yt-tools-ext-general-style';
    document.documentElement.appendChild(el);
  }
  el.textContent = css;

  applyCssVar(!!result.GeneralIsActivePrimaryColor, 'var(--primary-color-text)', '--yt-spec-text-primary');
  applyCssVar(!!result.GeneralIsActiveSecondaryColor, 'var(--secondary-color)', '--yt-spec-text-secondary');
  applyCssVar(!!result.GeneralIsActiveIconColor, 'var(--icons-color)', '--yt-spec-wordmark-text');
  applyCssVar(!!result.GeneralIsActiveIconColor, 'var(--icons-color)', '--yt-spec-brand-icon-inactive');
  applyCssVar(!!result.GeneralIsActiveMenuColor, 'var(--menu-color)', '--yt-spec-menu-background');
  applyCssVar(!!result.GeneralIsActiveLineVideoColor, 'var(--line-color-preview)', '--yt-spec-static-brand-red');
  applyCssVar(!!result.GeneralIsActiveTimeVideoColor, 'var(--time-color-preview)', '--yt-spec-static-brand-white');
}

function applyTheme(color?: string) {
  if (color) {
    document.documentElement.style.setProperty('--yt-spec-base-background', color);
  } else {
    document.documentElement.style.removeProperty('--yt-spec-base-background');
  }
}

export function initThemeBridge() {
  const refresh = () => {
    chrome.storage.local.get(generalKeys, (result) => applyGeneral(result));
    chrome.storage.local.get(['ThemesSelectedTheme'], (result) => {
      applyTheme(result.ThemesSelectedTheme);
    });
  };

  refresh();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (Object.keys(changes).some((k) => k.startsWith('General') || k.startsWith('Themes'))) {
      refresh();
    }
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request?.message === 'ToggleGeneral' || request?.message === 'ToggleThemes') {
      refresh();
    }
    if (request?.message === 'ResetThemes') {
      applyTheme(undefined);
    }
  });
}
