// Definir las claves de configuración
const generalKeys = [
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
];

const themesKeys = [
  "ThemesIsActiveTheme",
  "ThemesSelectedTheme"
]


// Función para aplicar estilos
function applyStyles(isActive, color, styleProperty) {
  if (isActive) {
    document.body.style.setProperty(styleProperty, color);
  } else {
    document.body.style.removeProperty(styleProperty);
  }
}
let estiloExistente = document.getElementById('estilo-dinamico') || document.createElement('style');
estiloExistente.id = 'estilo-dinamico';


function generarEstilosGenerales(result) {
  return `
  :root {
    --primary-color-text: ${result.GeneralPrimaryColor};
    --secondary-color: ${result.GeneralSecondaryColor};
    --icons-color: ${result.GeneralIconColor};
    --line-color-preview: ${result.GeneralLineVideoColor};
    --time-color-preview: ${result.GeneralTimeVideoColor };
    --header-color: ${result.GeneralHeaderColor };
    --menu-color: ${result.GeneralMenuColor };
    --theme-selected-color: ${result.ThemesSelectedTheme };
  }
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
      color: var(--icons-color);
      background-color: #7070718d;
    }
    #logo-icon {
      color: var(--icons-color);
    }
   
  `;
}

function generarEstilosAdicionales(result) {
  return `
  #background.ytd-masthead {
    background-color: ${result.GeneralIsActiveHeaderColor ? result.GeneralHeaderColor:  ""};
  }
  `;
}

function aplicarEstilos(clase, estilos) {
  let estiloExistente = document.getElementById(clase) || document.createElement('style');
  estiloExistente.id = clase;
  estiloExistente.innerHTML = estilos;

  if (!document.getElementById(clase)) {
    document.head.appendChild(estiloExistente);
  }
}

function cambiarColores() {
  chrome.storage.local.get(generalKeys, (result) => {
    const estilosGenerales = generarEstilosGenerales(result);
    const estilosAdicionales = generarEstilosAdicionales(result);
    
    // Concatenar estilos generales y adicionales
    const todosLosEstilos = estilosGenerales + estilosAdicionales;

    aplicarEstilos('estilos-combinados', todosLosEstilos);
  });
}

function applyThemes() {

  chrome.storage.local.get(themesKeys, (result) => {
   
    applyStyles(
     true,
       result.ThemesSelectedTheme,
       "--yt-spec-base-background"
     );
    })
}


function applySettings() {
    cambiarColores()
    chrome.storage.local.get(generalKeys, (result) => {

      applyStyles(
        true,
        `${result.GeneralIsActivePrimaryColor && result.GeneralPrimaryColor ? "var(--primary-color-text" : ""}`,
        "--yt-spec-text-primary"
      );
  
      // Llamar a applyStyles para el segundo conjunto de opciones
      applyStyles(
        true,
        `${result.GeneralIsActiveSecondaryColor && result.GeneralSecondaryColor ? "var(--secondary-color" : ""}`,
        "--yt-spec-text-secondary"
      );
      applyStyles(
        true,
        `${result.GeneralIsActiveIconColor && result.GeneralIconColor ? "var(--icons-color" : ""}`,
        "--yt-spec-wordmark-text"
      );
      // Icons sidebar inactive
      applyStyles(
        true,
        `${result.GeneralIsActiveIconColor && result.GeneralIconColor ? "var(--icons-color" : ""}`,
        "--yt-spec-brand-icon-inactive"
      );
      applyStyles(
        true,
        `${result.GeneralIsActiveMenuColor && result.GeneralMenuColor ? "var(--menu-color" : ""}`,
        "--yt-spec-menu-background"
      );
  
    applyStyles(
      true,
      `${result.GeneralIsActiveLineVideoColor && result.GeneralLineVideoColor ? "var(--line-color-preview" : ""}`,
      "--yt-spec-static-brand-red"
    );
  
    applyStyles(
      true,
      `${result.GeneralIsActiveTimeVideoColor && result.GeneralTimeVideoColor ? "var(--time-color-preview" : ""}`,
      "--yt-spec-static-brand-white"
    );
    });

}

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const key in changes) {
    if (namespace === "local" && key.startsWith("General")) {
      applySettings();
      break;
    }
    if (namespace === "local" && key.startsWith("Themes")) {
      applyThemes();
      // if(cinematicsIsActive !=) {
      //   cinematicsIsActive.click();
      // }
      break;
    }
  }
});

// Escuchar los mensajes
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "ToggleGeneral") {
    applySettings();
  }
  if (request.message === "ToggleThemes") {
    applyThemes();
  }
});

applySettings();
applyThemes();
