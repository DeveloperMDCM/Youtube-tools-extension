// import { useState, useEffect } from "react";
import { ThemesSelect } from "../components/ThemesSelect";
// interface themes {
//   ThemesIsActiveTheme: boolean;
//   ThemesSelectedTheme: string;
// }
// const themesKeys = [
//   "ThemesIsActiveTheme",
//   "ThemesSelectedTheme",
// ];
export const Themes = () => {
  // const [themes, setThemes] = useState<themes>({
  //   ThemesIsActiveTheme: false,
  //   ThemesSelectedTheme: "",
  // });
  // useEffect(() => {
   

  //   chrome.storage.local.get(
  //     themesKeys,
  //     ({
  //       ThemesIsActiveTheme,
  //       ThemesSelectedTheme,
  //     }) => {
  //       setThemes({
  //         ThemesIsActiveTheme: ThemesIsActiveTheme || false,
  //         ThemesSelectedTheme: ThemesSelectedTheme || "",
  //       });
  //     }
  //   );

  //   chrome.storage.local.onChanged.addListener((changes) => {
  //     if (changes) {
  //       setThemes((prev) => ({
  //         ThemesIsActiveTheme:
  //           changes.ThemesIsActiveTheme?.newValue ??
  //           prev.ThemesIsActiveTheme,
  //           ThemesSelectedTheme:
  //           changes.ThemesSelectedTheme?.newValue ??
  //           prev.ThemesSelectedTheme,
  //       }));
  //     }
  //   });
  // }, []);
  
  // const updatethemes = (newState: themes) => {
  //   chrome.windows.getAll({ populate: true }, function (windows) {
  //     windows.forEach((window) => {
  //       window.tabs?.forEach((tab) => {
  //         if (
  //           tab.url !== undefined &&
  //           tab.url.includes("youtube.com") &&
  //           tab.id !== undefined
  //         ) {
  //           chrome.tabs.sendMessage(tab.id, {
  //             message: "ToggleGeneral",
  //             data: newState,
  //           });
  //         }
  //       });
  //     });
  //   });
  //   chrome.storage.local.set(newState);
  // };
 
  return (
    <ThemesSelect />
  )
}
