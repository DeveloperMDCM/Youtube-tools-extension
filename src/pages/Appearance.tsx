import { useState } from "react";
import { palette_themes } from "../constants/colors"
import { Card } from "../components/Card";
export const Appearance = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };
  return (
    <Card title="Colors" description="Colors of Page" info="General Settings">
    {palette_themes.map((color, index) => (
        <div style={{ backgroundColor: color}} className=" flex shadow-xl border-2 border-gray-500 rounded-xl mt-2 justify-between mb-4 " key={index}>
          <input
          className="w-7 ml-5"
            type="radio"
            id={`color${index}`} 
            name="colorGroup"
            value={color}
            checked={selectedColor === color}
            onChange={() => handleColorChange(color)}
          />
          <label className="w-full  h-16 text-center rounded-md" htmlFor={`color${index}`} >
           
              <span className="text-white cursor-pointer font-bold h-full w-full flex justify-center items-center">
              {color}
              </span>
          
          </label>
        </div>
      ))}
   </Card>
  )
}
