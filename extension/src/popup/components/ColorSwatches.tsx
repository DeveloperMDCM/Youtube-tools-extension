const DEFAULT_PALETTE = [
  '#000000',
  '#0f0f0f',
  '#1a1a1a',
  '#252525',
  '#3a3a3a',
  '#ffffff',
  '#cccccc',
  '#999999',
  '#ff0000',
  '#ff4444',
  '#ff8800',
  '#ffcc00',
  '#00ff00',
  '#00cc66',
  '#00ffff',
  '#0088ff',
  '#0c02a0',
  '#7c3aed',
  '#ff66cc',
  '#ff00aa',
];

function normalizeHex(c: string) {
  return (c || '').trim().toLowerCase();
}

export function ColorSwatches({
  label,
  value,
  onChange,
  colors = DEFAULT_PALETTE,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
}) {
  const current = normalizeHex(value);
  const known = colors.some((c) => normalizeHex(c) === current);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white/90">{label}</span>
        <span
          className="h-5 w-5 shrink-0 rounded-md border border-white/25"
          style={{ backgroundColor: value || '#000' }}
          title={value}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((c) => {
          const selected = normalizeHex(c) === current;
          return (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => onChange(c)}
              className={`h-7 w-7 rounded-md border-2 transition ${
                selected ? 'scale-110 border-white shadow-md shadow-black/40' : 'border-white/15 hover:border-white/40'
              }`}
              style={{ backgroundColor: c }}
            />
          );
        })}
        {!known && value ? (
          <button
            type="button"
            title={value}
            onClick={() => onChange(value)}
            className="h-7 w-7 scale-110 rounded-md border-2 border-red-400"
            style={{ backgroundColor: value }}
          />
        ) : null}
      </div>
    </div>
  );
}
