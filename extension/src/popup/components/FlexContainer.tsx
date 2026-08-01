import type { ChangeEvent, ReactNode } from 'react';

export function FlexContainer({
  text,
  color,
  children,
  checked,
  onChange,
}: {
  text: string;
  color: string;
  children: ReactNode;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const glow = color || '#fff';
  return (
    <div className="relative flex justify-between p-3">
      <label className="mt-3 flex h-full items-center gap-3">
        <input type="checkbox" checked={checked} onChange={onChange} className="check" hidden />
        <span className="checkmark" />
        <i
          style={{
            filter: 'brightness(250%)',
            color: glow,
            textShadow: `0 2px 20px ${glow}`,
          }}
          className="fa-solid fa-swatchbook text-2xl"
        />
        <span className="text-2xl font-bold text-white">{text}</span>
      </label>
      {children}
    </div>
  );
}
