import { useState, useEffect } from "react";
import { palette_themes } from "../constants/colors";
import { Card } from "./Card";
import { getMessage } from "../i18n";

export const ThemesSelect = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(
      "ThemesSelectedTheme",
      ({ ThemesSelectedTheme }) => {
        setSelectedColor(ThemesSelectedTheme || null);
      }
    );

    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      const newSelectedTheme = changes.ThemesSelectedTheme?.newValue;
      if (newSelectedTheme !== undefined) {
        setSelectedColor(newSelectedTheme);

        chrome.windows.getAll({ populate: true }, function (windows) {
          windows.forEach((window) => {
            window.tabs?.forEach((tab) => {
              if (
                tab.url !== undefined &&
                tab.url.includes("youtube.com") &&
                tab.id !== undefined
              ) {
                chrome.tabs.sendMessage(tab.id, {
                  message: "ToggleGeneral",
                  data: { ThemesSelectedTheme: newSelectedTheme },
                });
              }
            });
          });
        });
      }
    };

    chrome.storage.local.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleReset = () => {
    setSelectedColor(null);
    chrome.storage.local.remove("ThemesSelectedTheme");

    // Asumiendo que también quieres enviar un mensaje para resetear el tema
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;
      if (activeTabId !== undefined) {
        chrome.tabs.sendMessage(activeTabId, {
          message: "ResetThemes",
        });
      }
    });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    chrome.storage.local.set({ ThemesSelectedTheme: color });
  };
  // const rearrangedThemes = selectedColor
  // ? [selectedColor, ...palette_themes.filter((color) => color !== selectedColor)]
  // : palette_themes;

  return (
    <Card
      title={getMessage("global.text.themes")}
      description={getMessage("themes.setting.description")}
      info={getMessage("themes.setting.info.description")}
    >
      <div className="text-end top-10 sticky z-10">
        <div className="right-10 -top-10 absolute">
          <i
            style={{ color: selectedColor!, textShadow: `0 0 10px #fff` }}
            className={`fa-solid drop-shadow-xl fa-droplet text-5xl brightness-90 animate-bounce`}
          ></i>
        </div>
      </div>
      <div className="flex items-center gap-2  text-white text-2xl hover:cursor-pointer">
        <button onClick={handleReset}>
          <i className="fa-solid fa-rotate-left"></i>
          <span> Reset</span>
        </button>
      </div>
      {palette_themes.map((color, index) => (
        <div
          style={{ backgroundColor: color }}
          className="flex shadow-xl border-2 transition-all delay-75 border-gray-500 rounded-xl mt-2 justify-between mb-4"
          key={index}
        >
          <input
            className="w-7 ml-5"
            type="radio"
            id={`color${index}`}
            name="colorGroup"
            value={color}
            checked={selectedColor === color}
            onChange={() => handleColorChange(color)}
          />
          <label
            className="w-full h-16 text-center rounded-md"
            htmlFor={`color${index}`}
          >
            <span className="text-white cursor-pointer font-bold h-full w-full flex justify-center items-center">
             <h4 className="hover:text-2xl">{color}</h4>
            </span>
          </label>
        </div>
      ))}
    </Card>
  );
};
