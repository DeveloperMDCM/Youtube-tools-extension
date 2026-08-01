import type { ReactNode } from 'react';

export function Card({
  title,
  description,
  info,
  children,
}: {
  title: string;
  description: string;
  info: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 w-full rounded-md bg-gray-800 p-3 shadow">
      <h5 className="mb-2 text-xl font-semibold text-white">{title}</h5>
      <p className="text-sm font-normal text-gray-400">{description}</p>
      {children}
      <div className="mt-2 text-sm text-white">
        <i className="fa-solid fa-circle-info mr-2" />
        {info}
      </div>
    </div>
  );
}
