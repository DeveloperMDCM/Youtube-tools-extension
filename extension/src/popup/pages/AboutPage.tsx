import { isExtensionContext } from '@shared/browser';

export function AboutPage() {
  const preview = !isExtensionContext();

  return (
    <section className="stack about">
      <p>
        Multi-browser extension for YouTube Tools. Open this popup from the toolbar icon, or
        preview the UI with <code>npm run dev</code>.
      </p>
      <ul>
        <li>Chrome · Edge · Firefox (MV3)</li>
        <li>Popup preview on localhost without packing</li>
        <li>Settings sync via extension storage</li>
      </ul>
      <p className="muted">
        Mode: {preview ? 'Vite preview (localStorage mock)' : 'Installed extension'}
      </p>
      <p className="muted">by DeveloperMDCM</p>
    </section>
  );
}
