export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2.5 text-left hover:bg-white/10"
    >
      <span
        className={`checkmark !h-5 !w-5 !rounded-md ${checked ? 'is-on' : ''}`}
        data-checked={checked ? '1' : '0'}
      />
      <span className="text-[11px] font-semibold leading-snug opacity-95">{label}</span>
    </button>
  );
}

export function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
      <label className="mb-2 block text-sm font-semibold opacity-95">{label}</label>
      {children}
    </div>
  );
}
