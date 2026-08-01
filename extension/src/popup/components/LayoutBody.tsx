export function LayoutBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-0 flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: 420 }}>
      {children}
    </div>
  );
}
