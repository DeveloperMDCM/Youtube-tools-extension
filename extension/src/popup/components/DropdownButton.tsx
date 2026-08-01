import { useState, type ReactNode } from 'react';

export function DropdownButton({ text, children }: { text: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-[200px] items-center justify-between whitespace-pre-wrap rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-100 hover:bg-red-800"
      >
        {text}
        <i className={`fa-solid ${open ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
      </button>
      <ul className={`${open ? '' : 'hidden'} text-gray-700`}>
        <li className="flex justify-center p-2">{children}</li>
      </ul>
    </div>
  );
}
