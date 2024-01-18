import { ChangeEvent } from 'react';
interface FlexContainer {
    text: string;
    color: string;
    children: React.ReactNode;
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }
export const FlexContainer = ({text, color, children, checked, onChange}: FlexContainer) => {
  return (
    <div className="flex p-3 justify-between  relative">
    <label className="flex gap-3 h-full mt-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className='check'
        hidden
      />
      <span className="checkmark"></span>
      <i style={{filter: 'brightness(250%)', color: color ? color : '#fff', textShadow: `0 2px 20px ${color ? color : '#fff'}`}} className="fa-solid fa-swatchbook text-2xl"></i>
      <span className="font-bold text-2xl text-white">{text}</span>
    </label>
    {children}
  </div>
  )
}
