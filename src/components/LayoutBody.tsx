interface LayoutBody {
  children: React.ReactNode;
  }
  export const LayoutBody = ({ children }: LayoutBody) => {
  return (
   <div className="max-h-[380px] h-auto p-3 overflow-hidden overflow-y-auto relative z-[0]">
    {children}
   </div>
  );
};

