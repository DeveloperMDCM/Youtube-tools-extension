import React, { useState, useEffect } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { DropdownButton } from "../components/DropdownButton";
import { FlexContainer } from "../components/FlexContainer";
import { Card } from "../components/Card";
import { getMessage } from "../i18n";
import {palette_1, palette_2, palette_header} from "../constants/colors";

interface PopupProps {}

interface general {
  GeneralIsActivePrimaryColor: boolean;
  GeneralIsActiveSecondaryColor: boolean;
  GeneralIsActiveIconColor: boolean;
  GeneralPrimaryColor: string;
  GeneralSecondaryColor: string;
  GeneralIconColor: string;
  GeneralIsActiveLineVideoColor: boolean;
  GeneralLineVideoColor: string;
  GeneralIsActiveTimeVideoColor: boolean;
  GeneralTimeVideoColor: string;
  GeneralIsActiveHeaderColor: boolean;
  GeneralHeaderColor: string;
  GeneralIsActiveMenuColor: boolean;
  GeneralMenuColor: string;
  GeneralSubIsActivethumbnailVideo: boolean;
  GeneralSubIsActivemodeReverse: boolean;
  GeneralSubIsActivefilterEyes: boolean;
  GeneralSubIsActiveresetButton: boolean;
  GeneralSubIsActiverepeatVideo: boolean;
  GeneralSubIsActivedownloadMp4Mp3: boolean;
  GeneralSubIsActivedonwloadExternal: boolean;
  GeneralSubIsActiveviewExternalVideo: boolean;
  GeneralSubIsActivepictureToPicture: boolean;
  GeneralSubIsActiveScreenShot: boolean;
}
const configKeys = [
  "GeneralIsActivePrimaryColor",
  "GeneralPrimaryColor",
  "GeneralIsActiveSecondaryColor",
  "GeneralSecondaryColor",
  "GeneralIsActiveIconColor",
  "GeneralIconColor",
  "GeneralIsActiveLineVideoColor",
  "GeneralLineVideoColor",
  "GeneralIsActiveTimeVideoColor",
  "GeneralTimeVideoColor",
  "GeneralIsActiveHeaderColor",
  "GeneralHeaderColor",
  "GeneralIsActiveMenuColor",
  "GeneralMenuColor",
  "GeneralSubIsActivethumbnailVideo",
  "GeneralSubIsActivemodeReverse",
  "GeneralSubIsActivefilterEyes",
  "GeneralSubIsActiveresetButton",
  "GeneralSubIsActiverepeatVideo",
  "GeneralSubIsActivedownloadMp4Mp3",
  "GeneralSubIsActivedonwloadExternal",
  "GeneralSubIsActiveviewExternalVideo",
  "GeneralSubIsActivepictureToPicture",
  "GeneralSubIsActiveScreenShot",
];

const generateCheckedColor = (
  checked: boolean,
  toggleHandler: () => void,
  color: string,
  text: string,
  palette: string[],
  colorChangeHandler: (color: ColorResult) => void
) => (
  <FlexContainer checked={checked} onChange={toggleHandler} color={color === 'transparent' ? '#ffffff' : color} text={text}>
    {checked && (
      <DropdownButton text={getMessage("global.text.color")}>
        <CirclePicker
          width="200px"
          color={color}
          colors={palette}
          circleSize={25.5}
          onChange={colorChangeHandler}
        />
      </DropdownButton>
    )}
  </FlexContainer>
);
const generalSubMenuBody = (
  checked: boolean,
  toggleHandler: () => void,
  text: string,
) => (
  <FlexContainer checked={checked} onChange={toggleHandler} color={""} text={text}>
    <></>
  </FlexContainer>
);

export const General: React.FC<PopupProps> = () => {
  const [general, setGeneral] = useState<general>({
    GeneralIsActivePrimaryColor: false,
    GeneralIsActiveSecondaryColor: false,
    GeneralIsActiveIconColor: false,
    GeneralPrimaryColor: "",
    GeneralSecondaryColor: "",
    GeneralIconColor: "",
    GeneralIsActiveLineVideoColor: false,
    GeneralLineVideoColor: "",
    GeneralIsActiveTimeVideoColor: false,
    GeneralTimeVideoColor: "",
    GeneralIsActiveHeaderColor: false,
    GeneralHeaderColor: "",
    GeneralIsActiveMenuColor: false,
    GeneralMenuColor: "",
    GeneralSubIsActivethumbnailVideo: false,
    GeneralSubIsActivemodeReverse: false,
    GeneralSubIsActivefilterEyes: false,
    GeneralSubIsActiveresetButton: false,
    GeneralSubIsActiverepeatVideo: false,
    GeneralSubIsActivedownloadMp4Mp3: false,
    GeneralSubIsActivedonwloadExternal: false,
    GeneralSubIsActiveviewExternalVideo: false,
    GeneralSubIsActivepictureToPicture: false,
    GeneralSubIsActiveScreenShot: false,
  });

  useEffect(() => {
    // chrome.runtime.sendMessage({
    //   message: 'LanguageChange',
    //   language: chrome.i18n.getUILanguage(),
    // });

    chrome.storage.local.get(
      configKeys,
      ({
        GeneralIsActivePrimaryColor,
        GeneralPrimaryColor,
        GeneralIsActiveSecondaryColor,
        GeneralSecondaryColor,
        GeneralIsActiveIconColor,
        GeneralIconColor,
        GeneralIsActiveLineVideoColor,
        GeneralLineVideoColor,
        GeneralIsActiveTimeVideoColor,
        GeneralTimeVideoColor,
        GeneralIsActiveHeaderColor,
        GeneralHeaderColor,
        GeneralIsActiveMenuColor,
        GeneralMenuColor,
        GeneralSubIsActivethumbnailVideo,
        GeneralSubIsActivemodeReverse,
        GeneralSubIsActivefilterEyes,
        GeneralSubIsActiveresetButton,
        GeneralSubIsActiverepeatVideo,
        GeneralSubIsActivedownloadMp4Mp3,
        GeneralSubIsActivedonwloadExternal,
        GeneralSubIsActiveviewExternalVideo,
        GeneralSubIsActivepictureToPicture,
        GeneralSubIsActiveScreenShot,
      }) => {
        setGeneral({
          GeneralIsActivePrimaryColor: GeneralIsActivePrimaryColor || false,
          GeneralIsActiveSecondaryColor: GeneralIsActiveSecondaryColor || false,
          GeneralIsActiveIconColor: GeneralIsActiveIconColor || false,
          GeneralPrimaryColor: GeneralPrimaryColor || "",
          GeneralSecondaryColor: GeneralSecondaryColor || "",
          GeneralIconColor: GeneralIconColor || "",
          GeneralIsActiveLineVideoColor: GeneralIsActiveLineVideoColor || false,
          GeneralLineVideoColor: GeneralLineVideoColor || "",
          GeneralIsActiveTimeVideoColor: GeneralIsActiveTimeVideoColor || false,
          GeneralTimeVideoColor: GeneralTimeVideoColor || "",
          GeneralIsActiveHeaderColor: GeneralIsActiveHeaderColor || false,
          GeneralHeaderColor: GeneralHeaderColor || "",
          GeneralIsActiveMenuColor: GeneralIsActiveMenuColor || false,
          GeneralMenuColor: GeneralMenuColor || "",
          GeneralSubIsActivethumbnailVideo: GeneralSubIsActivethumbnailVideo || false,
          GeneralSubIsActivemodeReverse: GeneralSubIsActivemodeReverse || false,
          GeneralSubIsActivefilterEyes: GeneralSubIsActivefilterEyes || false,
          GeneralSubIsActiveresetButton: GeneralSubIsActiveresetButton || false,
          GeneralSubIsActiverepeatVideo: GeneralSubIsActiverepeatVideo || false,
          GeneralSubIsActivedownloadMp4Mp3: GeneralSubIsActivedownloadMp4Mp3 || false,
          GeneralSubIsActivedonwloadExternal: GeneralSubIsActivedonwloadExternal || false,
          GeneralSubIsActiveviewExternalVideo: GeneralSubIsActiveviewExternalVideo || false,
          GeneralSubIsActivepictureToPicture: GeneralSubIsActivepictureToPicture || false,
          GeneralSubIsActiveScreenShot: GeneralSubIsActiveScreenShot || false,
        });
      }
    );

    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes) {
        setGeneral((prev) => ({
          GeneralIsActivePrimaryColor:
            changes.GeneralIsActivePrimaryColor?.newValue ??
            prev.GeneralIsActivePrimaryColor,
          GeneralIsActiveSecondaryColor:
            changes.GeneralIsActiveSecondaryColor?.newValue ??
            prev.GeneralIsActiveSecondaryColor,
          GeneralPrimaryColor:
            changes.GeneralPrimaryColor?.newValue ?? prev.GeneralPrimaryColor,
          GeneralSecondaryColor:
            changes.GeneralSecondaryColor?.newValue ??
            prev.GeneralSecondaryColor,
          GeneralIsActiveIconColor:
            changes.GeneralIsActiveIconColor?.newValue ??
            prev.GeneralIsActiveIconColor,
          GeneralIconColor:
            changes.GeneralIconColor?.newValue ?? prev.GeneralIconColor,
          GeneralIsActiveLineVideoColor:
            changes.GeneralIsActiveLineVideoColor?.newValue ??
            prev.GeneralIsActiveLineVideoColor,
          GeneralLineVideoColor:
            changes.GeneralLineVideoColor?.newValue ??
            prev.GeneralLineVideoColor,
          GeneralIsActiveTimeVideoColor:
            changes.GeneralIsActiveTimeVideoColor?.newValue ??
            prev.GeneralIsActiveTimeVideoColor,
          GeneralTimeVideoColor:
            changes.GeneralTimeVideoColor?.newValue ??
            prev.GeneralTimeVideoColor,
          GeneralIsActiveHeaderColor:
            changes.GeneralIsActiveHeaderColor?.newValue ??
            prev.GeneralIsActiveHeaderColor,
          GeneralHeaderColor:
            changes.GeneralHeaderColor?.newValue ??
            prev.GeneralHeaderColor,
          GeneralIsActiveMenuColor:
            changes.GeneralIsActiveMenuColor?.newValue ??
            prev.GeneralIsActiveMenuColor,
          GeneralMenuColor:
            changes.GeneralMenuColor?.newValue ??
            prev.GeneralMenuColor,
          GeneralSubIsActivethumbnailVideo:
            changes.GeneralSubIsActivethumbnailVideo?.newValue ??
            prev.GeneralSubIsActivethumbnailVideo,
          GeneralSubIsActivemodeReverse:
            changes.GeneralSubIsActivemodeReverse?.newValue ??
            prev.GeneralSubIsActivemodeReverse,
          GeneralSubIsActivefilterEyes:
            changes.GeneralSubIsActivefilterEyes?.newValue ??
            prev.GeneralSubIsActivefilterEyes,
          GeneralSubIsActiveresetButton:
            changes.GeneralSubIsActiveresetButton?.newValue ??
            prev.GeneralSubIsActiveresetButton,
          GeneralSubIsActiverepeatVideo:
            changes.GeneralSubIsActiverepeatVideo?.newValue ??
            prev.GeneralSubIsActiverepeatVideo,
          GeneralSubIsActivedownloadMp4Mp3:
            changes.GeneralSubIsActivedownloadMp4Mp3?.newValue ??
            prev.GeneralSubIsActivedownloadMp4Mp3,
          GeneralSubIsActivedonwloadExternal:
            changes.GeneralSubIsActivedonwloadExternal?.newValue ??
            prev.GeneralSubIsActivedonwloadExternal,
          GeneralSubIsActiveviewExternalVideo:
            changes.GeneralSubIsActiveviewExternalVideo?.newValue ??
            prev.GeneralSubIsActiveviewExternalVideo,
            GeneralSubIsActivepictureToPicture:
            changes.GeneralSubIsActivepictureToPicture?.newValue ??
            prev.GeneralSubIsActivepictureToPicture,
            GeneralSubIsActiveScreenShot:
            changes.GeneralSubIsActiveScreenShot?.newValue ??
            prev.GeneralSubIsActiveScreenShot,
        }));
      }
    });
  }, []);

  const updategeneral = (newState: general) => {
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
              data: newState,
            });
          }
        });
      });
    });

    chrome.storage.local.set(newState);
  };

  const handleToggle = (key: keyof general) => () => {
    setGeneral((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    const newState = { ...general, [key]: !general[key] };
    updategeneral(newState);
  };

  const handleColorChange =
    (key: keyof general) => (color: ColorResult) => {
      const newColor = color.hex;
      setGeneral((prev) => ({
        ...prev,
        [key]: newColor,
      }));

      const newState = { ...general, [key]: newColor };
      updategeneral(newState);
    };
  return (
    <>
       <Card
        title={getMessage("global.text.colors")}
        info={getMessage("general.setting.info.description")}
        description={getMessage("general.setting.description")}
      >
        {generateCheckedColor(
          general.GeneralIsActivePrimaryColor,
          handleToggle("GeneralIsActivePrimaryColor"),
          general.GeneralPrimaryColor,
          getMessage("primary.color"),
          palette_1,
          handleColorChange("GeneralPrimaryColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveSecondaryColor,
          handleToggle("GeneralIsActiveSecondaryColor"),
          general.GeneralSecondaryColor,
          getMessage("secondary.color"),
          palette_1,
          handleColorChange("GeneralSecondaryColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveIconColor,
          handleToggle("GeneralIsActiveIconColor"),
          general.GeneralIconColor,
          getMessage("icon.color"),
          palette_1,
          handleColorChange("GeneralIconColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveLineVideoColor,
          handleToggle("GeneralIsActiveLineVideoColor"),
          general.GeneralLineVideoColor,
          getMessage("line.color.preview.video"),
          palette_1,
          handleColorChange("GeneralLineVideoColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveTimeVideoColor,
          handleToggle("GeneralIsActiveTimeVideoColor"),
          general.GeneralTimeVideoColor,
          getMessage("time.color.preview.video"),
          palette_2,
          handleColorChange("GeneralTimeVideoColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveHeaderColor,
          handleToggle("GeneralIsActiveHeaderColor"),
          general.GeneralHeaderColor,
          getMessage("header.color"),
          palette_header,
          handleColorChange("GeneralHeaderColor")
        )}
        {generateCheckedColor(
          general.GeneralIsActiveMenuColor,
          handleToggle("GeneralIsActiveMenuColor"),
          general.GeneralMenuColor,
          getMessage("menu.color"),
          palette_header,
          handleColorChange("GeneralMenuColor")
        )}

        {generalSubMenuBody(
          general.GeneralSubIsActivethumbnailVideo,
          handleToggle("GeneralSubIsActivethumbnailVideo"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActivemodeReverse,
          handleToggle("GeneralSubIsActivemodeReverse"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActivefilterEyes,
          handleToggle("GeneralSubIsActivefilterEyes"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActiveresetButton,
          handleToggle("GeneralSubIsActiveresetButton"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActiverepeatVideo,
          handleToggle("GeneralSubIsActiverepeatVideo"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActivedownloadMp4Mp3,
          handleToggle("GeneralSubIsActivedownloadMp4Mp3"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActivedonwloadExternal,
          handleToggle("GeneralSubIsActivedonwloadExternal"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActiveviewExternalVideo,
          handleToggle("GeneralSubIsActiveviewExternalVideo"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActivepictureToPicture,
          handleToggle("GeneralSubIsActivepictureToPicture"),
          getMessage("menu.color"),
        )}
        {generalSubMenuBody(
          general.GeneralSubIsActiveScreenShot,
          handleToggle("GeneralSubIsActiveScreenShot"),
          getMessage("menu.color"),
        )}
       
       
      </Card>
    </>
  );
};
