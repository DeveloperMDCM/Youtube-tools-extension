const defaultGeneralState = {
  GeneralIsActivePrimaryColor: false,
  GeneralPrimaryColor: "",
  GeneralIsActiveSecondaryColor: false,
  GeneralSecondaryColor: "",
  GeneralIsActiveIconColor: false,
  GeneralIconColor: "",
  GeneralIsActiveLineVideoColor: false,
  GeneralLineVideoColor: "",
  GeneralIsActiveTimeVideoColor: false,
  GeneralTimeVideoColor: "",
  GeneralSubIsActivethumbnailVideo: true,
  GeneralSubIsActivemodeReverse: true,
  GeneralSubIsActivefilterEyes: true,
  GeneralSubIsActiveresetButton: true,
  GeneralSubIsActiverepeatVideo: true,
  GeneralSubIsActivedownloadMp4Mp3: true,
  GeneralSubIsActivedonwloadExternal: true,
  GeneralSubIsActiveviewExternalVideo: true,   
  GeneralSubIsActivepictureToPicture: true,   
  GeneralSubIsActiveScreenShot: true,   
};

const defaultThemesState = {
  ThemesIsActiveTheme: true,
  ThemesSelectedTheme: ""
}

chrome.runtime.onInstalled.addListener(() => {
  // Obtén valores predeterminados para GeneralState
  chrome.storage.local.get(defaultGeneralState, (resultGeneral) => {
    const initialStateGeneral = { ...defaultGeneralState, ...resultGeneral };

    // Obtén valores predeterminados para ThemesState
    chrome.storage.local.get(defaultThemesState, (resultThemes) => {
      const initialStateThemes = { ...defaultThemesState, ...resultThemes };

      // Combina ambos estados iniciales
      const initialState = { ...initialStateGeneral, ...initialStateThemes };

      // Almacena el estado inicial en el almacenamiento local
      chrome.storage.local.set(initialState);
    });
  });
});
