import { CirclePicker, ColorResult } from "react-color";
import { useState } from "react";
import { DropdownButton } from "../components/DropdownButton";
import { Card } from "../components/Card";
import { FlexContainer } from "../components/FlexContainer";
import { palette_1, palette_themes } from "../constants/colors";
// import { FlexContainer } from "../components/FlexContainer";
export const Settings = () => {
  // Estado para almacenar el color seleccionado
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [moi, setMoi] = useState<boolean>(true);
  // const [dislikes, setDislike] = useState<string>("");

  const [selectedColor3, setSelectedColor3] = useState<string | null>(null);

  const handleColorChange3 = (color: string) => {
    setSelectedColor3(color);
  }


  // Manejador de cambio de color
  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };
  const handleColorChange2 = () => {
    setMoi(moi);
  };
  
  // const moises  = async () => {
  //   const moises = await fetch('https://returnyoutubedislikeapi.com/Votes?videoId=vWVa-u8K0IE');
  //   const res = await moises.json();
  //   setDislike(res.likes)
  // }
  // moises();
  // const colorOptions = [
  //   "#c5352b",
  //   "#aa1849",
  //   "#333333",
  //   "#000929",
  //   "#0135f9",
  //   "#644203",
  //   "#036430",
  //   "#036264",
  //   "#080364",
  //   "#3e0364",
  //   "#64035f",
  //   "#640334",
  //   "#2c1a3b",
  // ];
  
  return (
    <>
    <div>
    <Card title="Colors" description="Colors of Page" info="General Settings">
      <div className="text-end  top-10 sticky">
      <div className="right-10 -top-10 absolute">
        <i style={{color: selectedColor3!, textShadow: `0 0 20px #fff`}} className={`fa-solid drop-shadow-xl fa-droplet text-5xl brightness-90 animate-bounce`}></i>
      </div>
      </div>
      <div className="flex items-center gap-2  text-white text-2xl hover:cursor-pointer">
      <i className="fa-solid fa-rotate-left"></i><span> Reset</span>
      </div>

      <div className="flex p-3 justify-between  relative">
    <label className="flex gap-3 h-full mt-3">
      <input
        type="checkbox"
     
       
        className='check'
        hidden
      />
      <span className="checkmark"></span>
      <span className="font-bold text-2xl shadow-2xl" style={{textShadow: "0 3px 20px #fff"}}>moises</span>
    </label>
  </div>
    {palette_themes.map((color, index) => (
        <div style={{ backgroundColor: color}} className=" flex shadow-xl border-2 border-gray-500 rounded-xl mt-2 justify-between mb-4 " key={index}>
          <input
          className="w-7 ml-5"
            type="radio"
            id={`color${index}`} 
            name="colorGroup"
            value={color}
            checked={selectedColor3 === color}
            onChange={() => handleColorChange3(color)}
          />
          <label className="w-full  h-16 text-center rounded-md" htmlFor={`color${index}`} >
           
              <span className="text-white cursor-pointer font-bold h-full w-full flex justify-center items-center">
              {color}
              </span>
          
          </label>
        </div>
      ))}
   </Card>
    </div>
    <Card title="Colors" description="Colors of Page" info="General Settings">
    <FlexContainer checked={moi}   color={selectedColor} text={'Primary color'} onChange={handleColorChange2} >
    <DropdownButton text="Color del texto" >

    <CirclePicker
      width="200px"
      color={selectedColor}
      colors={palette_1}
      circleSize={25.5}
      onChange={handleColorChange}
    />
    </DropdownButton>
</FlexContainer> 
    </Card>
{/* 
    <FlexContainer  color={selectedColor} text={'MOISES DAVID'} >


    <DropdownButton text="Color del texto" >
     
     <CirclePicker
       width="200px"
       color={selectedColor}
       colors={colors}
       circleSize={25.5}
       onChange={handleColorChange}
     />
   </DropdownButton>
    </FlexContainer>  */}
    


    </>
  );
};
