(function () {
  // Youtube tools by: DeveloperMDCM
  // https://github.com/DeveloperMDCM/Youtube-tools-extension

  "use strict";

  function paramsVideoURL() {
    const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
    return parametrosURL.get("v");
  }

  function cargarScript() {
    console.log("Scrip en ejecución by: DeveloperMDCM  MDCM");

    // alert('Script by: DeveloperMDCM', cat)
    let ad = true;

    const stylesCss = `
    <style>
    /* For Chrome or Safari */
    progress::-webkit-progress-bar {
      background-color: #ff0000;
      ;
    }
  
    progress::-webkit-progress-value {
      background-color: #06d406;
    }
  
    .clasic-mode-short svg{
      background-color: #272727;
      padding: 13px;
      border-radius: 50%;
      margin-bottom: 10px;
      color: #fff;
      cursor: pointer;
    }
    .clasic-mode-short svg:hover{
      background-color: #252525
    }
  
  
    /* For Firefox */
    progress {
      background-color: #ff0000;
      border: none;
    }
  
    progress::-moz-progress-bar {
      background-color: #06d406;
    }
  
    .barralikes {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    </style>
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Last-Modified" content="0">
    <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <style>
    .mdcm:hover {
      cursor: pointer;
    }
  
    .hidden {
      display: none;
    }
  
    .mdcm {
      font-size: 10px;
    }
  
    .btn_download {
      font-size: 1.2rem;
      padding: 3px;
      color: #fff;
      border-radius: 5px;
      background-color: #ec3203;
    }
  
    #subscribe-button>ytd-subscribe-button-renderer>yt-button-shape>button:hover {
      zoom: 0.9;
    }
  
    .containerButtons {
      position: relative;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
      user-select: none;
  
      border-radius: 20px;
      margin: 0 auto;
      padding: 4px;
    }
  
    .containerButtons button,
    input {
      display: flex;
      flex-direction: column-reverse;
      margin: 0 5px;
      align-items: center;
      cursor: pointer;
      border-radius: 10px;
    }
  
    .containerButtons h1,
    h2 {
      user-select: none;
    }
  
    #MDCM {
      animation: mdcm 10s infinite alternate;
      position: relative;
      transition: 4s;
    }
  
    .containerButtons button .containerButtons button svg {
      width: 50px;
      height: 40px;
    }
  
    #color,
    #eyes {
      opacity: 0;
      position: absolute;
      height: 90%;
      bottom: 0;
      top: 0;
      width: 17px;
    }
  
    /* width */
    ::-webkit-scrollbar {
      width: 4px;
      height: 10px;
    }
  
    /* Track */
    ::-webkit-scrollbar-track {
      background: ##d5d5d5;
  
    }
  
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #000;
  
    }
  
    .containerall {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .container .botoncalidades {
      margin: 3px 2px;
      width: 24.6%;
    }
  
    .botoncalidades:first-child {
      background-color: #0af;
    }
  
    .botoncalidades:last-child {
      background-color: red;
      width: 100px;
    }
  
    .selectcalidades,
    .botoncalidades,
    .selectcalidadesaudio {
      width: 50%;
      height: 27.8px;
      background-color: #fff;
      color: #000;
      font-size: 25px;
      text-align: center;
      border: none;
      font-size: 20px;
      margin: 2px 2px;
    }
  
    .botoncalidades {
      width: 70px;
      height: 30px;
      background-color: rgb(4, 156, 22);
      border: 0px solid #000;
      color: #fff;
      font-size: 20px;
      border-radius: 10px;
      margin: 2px 2px;
    }
  
    .botoncalidades:hover,
    .bntcontainer:hover {
      cursor: pointer;
    }
  
    .ocultarframe,
    .ocultarframeaudio {
      display: none;
    }
  
    .progress-button:hover {
      background-color: #000;
    }
  
    .progress-button {
      display: inline-block;
      font-size: 1em;
      color: #fff;
      text-decoration: none;
      line-height: 1;
      overflow: hidden;
      position: relative;
      text-align: center;
      width: 100%;
      height: 100%;
      box-shadow: 0 1px 1px #ccc;
      border-radius: 2px;
      cursor: pointer;
      background-color: #000;
    }
  
    #downloadButton:hover .progress-button {
      filter: brightness(95%);
    }
  
    .progress-button.in-progress,
    .progress-button.finished {
      color: red;
    }
  
    .progress-button.in-progress:after,
    .progress-button.finished:after {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      text-align: center;
      top: 0;
      padding-top: inherit;
      color: #fff;
      left: 0;
    }
  
    .progress-button.in-progress:after {
      content: attr(data-loading);
    }
  
    .progress-button.finished:after {
      content: attr(data-finished);
    }
  
    .progress-button .tz-bar {
      background-color: #f00;
      height: 3px;
      bottom: 0;
      left: 0;
      width: 0;
      position: absolute;
      z-index: 1;
      border-radius: 0 0 2px 2px;
      -webkit-transition: width 0.5s, height 0.5s;
      -moz-transition: width 0.5s, height 0.5s;
      transition: width 0.5s, height 0.5s;
    }
  
    .progress-button .tz-bar.background-horizontal {
      height: 100%;
      border-radius: 2px;
    }
  
    .progress-button .tz-bar.background-vertical {
      height: 0;
      top: 0;
      width: 100%;
      border-radius: 2px;
    }
  
    .buttonTitle {
      font-size: 0.5em;
      margin-top: 4px;
    }
  
    #containerbutton {
      height: 100px;
      text-align: center;
    }
  
    #containerbutton:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
  
    }
  
  
    #percentageText {
      width: 95%;
      display: inline-block;
      position: relative;
      vertical-align: middle;
      z-index: 3;
    }
  
    .headerbutton {
      position: fixed;
      top: 0;
      z-index: 1;
      width: 100%;
      background-color: #f1f1f1;
    }
  
    .progress-containerbutton {
      width: 99%;
      height: 20px;
      background: #3e3e3c;
    }
  
    .progress-bar {
      height: 20px;
      background: #f00;
      width: 0%;
    }
  
    .grecaptcha-badge {
      visibility: hidden;
    }
  
    button {
      margin: 0;
      padding: 0;
    }
  
    button:hover {
      color: #ec3203;
    }
    .botones_div {
      background-color: transparent;
      border: none;
      color: #999999;
    }
  
    </style>
    `;

    const thumbnailVideo = `
    <button title="Image video" class="botones_div" type="button" id="imagen">

    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo-down" width="24"
      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M15 8h.01"></path>
      <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"></path>
      <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4"></path>
      <path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559"></path>
      <path d="M19 16v6"></path>
      <path d="M22 19l-3 3l-3 -3"></path>
    </svg>
  </button>
    `;

    const modeReverse = `
    <button title="Reverse" class="botones_div" type="button" id="invertir">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-diff" width="24"
      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M11 16h10"></path>
      <path d="M11 16l4 4"></path>
      <path d="M11 16l4 -4"></path>
      <path d="M13 8h-10"></path>
      <path d="M13 8l-4 4"></path>
      <path d="M13 8l-4 -4"></path>
    </svg>
  </button>
    `;

    const filterEyes = `
    
    <div style="position:relative; display:inline-block ">
    <button title="Filter eyes" class="botones_div" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brightness-half"
        width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 9a3 3 0 0 0 0 6v-6z"></path>
        <path
          d="M6 6h3.5l2.5 -2.5l2.5 2.5h3.5v3.5l2.5 2.5l-2.5 2.5v3.5h-3.5l-2.5 2.5l-2.5 -2.5h-3.5v-3.5l-2.5 -2.5l2.5 -2.5z">
        </path>
      </svg>
      <input id="eyes" list="presetColors" type="color" value="#ffffff"></button>
    <datalist id="presetColors">
      <option value="#000000" />
      <option value="#fbff00" />
      <option value="#ff0000" />
      <option value="#00ff00" />
      <option value="#0000ff" />
    </datalist>
  </div>
  <div id="ojosprotect"
  style="position: fixed; pointer-events: none; width: 100%; height: 100%; left: 0px; top: 0px; opacity: 0.2; z-index: 10; display: block;">
</div>
    `;
    const resetButton = `
    <button title="reset" class="botones_div" type="button" id="reset">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-power" width="24"
      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 6a7.75 7.75 0 1 0 10 0"></path>
      <path d="M12 4l0 8"></path>
    </svg>
  </button>
    `;

    const repeatVideo = `
    <button title="Repeat video" class="botones_div" type="button" id="repeatvideo">

    <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat" width="24"
      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
      <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
    </svg>
  </button>
    `;

    const downloadMp4Mp3 = `
    <button title="MP4" type="button" class="btn1 botones_div">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-download"
      width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <path d="M12 17v-6"></path>
      <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
    </svg>
  </button>
  <button title="MP3" type="button" class="btn2 botones_div">

    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-music" width="24"
      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
      stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <path d="M11 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
      <path d="M12 16l0 -5l2 1"></path>
    </svg>
  </button>
  <button title="Close" type="button" class="btn3 botones_div">
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="24"
    height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
    stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M10 10l4 4m0 -4l-4 4"></path>
  </svg>
</button>
    `;

    const donwloadExternal = `
    
    <button title="External Download" type="button" class="external_link botones_div">
        
    <svg class="icon icon-tabler icon-tabler-external-link" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
        <path d="M11 13l9 -9"></path>
        <path d="M15 4h5v5"></path>
     </svg>
  </button>

    `;
    const viewExternalVideo = `
    
    <button title="view External no cookie" type="button" class="view_external_link botones_div">
        
    <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z" /><path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6" /><path d="M12 8h4v4" /><path d="M16 8l-5 5" /></svg>
  </button>

    `;

    const pictureToPicture = `
    <button title="Picture to picture" type="button" class="video_picture_to_picture botones_div">
        
    <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" /></svg>
  </button>

    `;
    const screenShot = `
    <button title="Picture to picture" type="button" class="screenshot_video botones_div">  
    <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /></svg>
  </button>

    `;

    // Menu Buttons
    const menuBotones = `
    <!DOCTYPE html>
    <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  </head>
  ${stylesCss}
<body>

<div class="container">
  <form>
    <div class="containerButtons">
    </div>
    <div>
    </div>
  </form>

</div>
<form class="formulariodescarga" action="">
  <div class="containerall">
  <select class="selectcalidades  ocultarframe" required>
    <option selected disabled>Calidad del video / Quality video</option>
    <option value="360">360p Mp4</option>
    <option value="480">480p Mp4</option>
    <option value="720">720p HD Mp4 Default</option>
    <option value="1080">1080p FULL HD Mp4</option>
    <option value="4k">2160p 4K WEBM</option>
    <option value="8k">4320p 8K WEBM</option>
    </select>
    <iframe id="descargando"  style="z-index: 99; border: none; height: 27.4px; width: 50%;"  class="containerall ocultarframe" src="" frameborder="0"></iframe>
 
  </div>
  </form>
  <form class="formulariodescargaaudio" action="">
  <div class="containerall">
  <select class="selectcalidadesaudio ocultarframeaudio" required>
    <option selected disabled>Calidad del Audio / Quality Audio</option>
    <option value="flac">Audio FLAC UHQ</option>
    <option value="wav">Audio WAV UHQ</option>
    <option value="mp3">Audio MP3 Default</option>
    <option value="m4a">Audio M4A</option>
    <option value="aac">Audio AAC</option>
    <option value="opus">Audio OPUS</option>
    <option value="ogg">Audio OGG</option>
    </select>
    <iframe id="descargandomp3"  style="z-index: 99; border: none; height: 27.4px; width: 50%;"  class="containerall ocultarframeaudio" src="" frameborder="0"></iframe>
 
    </iframe>
   
  </div>
  </form>
    </body>
    </html>
    `;

    let validoBotones = true;
    const generalKeys = [
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

    // TODO: Inicia y inserta los botones
    function renderizarContenido() {
      chrome.storage.local.get(generalKeys, (result) => {
        const addButton = document.querySelector(
          ".style-scope .ytd-watch-metadata"
        );
        if (addButton != undefined && validoBotones) {
          validoBotones = false;
          addButton.insertAdjacentHTML("beforebegin", menuBotones);
          // document.querySelector("video").style.borderRadius = "30px";
          const containerButtons = document.querySelector(".containerButtons");
          // Agregar cada contenido al contenedor si está activo
          if (containerButtons) {
            addButton.insertAdjacentHTML("beforebegin", menuBotones);

            containerButtons.innerHTML = "";
            const contentData = {
              thumbnailVideo: {
                active: result.GeneralSubIsActivethumbnailVideo,
                html: thumbnailVideo,
              },
              modeReverse: {
                active: result.GeneralSubIsActivemodeReverse,
                html: modeReverse,
              },
              filterEyes: {
                active: result.GeneralSubIsActivefilterEyes,
                html: filterEyes,
              },
              resetButton: {
                active: result.GeneralSubIsActiveresetButton,
                html: resetButton,
              },
              repeatVideo: {
                active: result.GeneralSubIsActiverepeatVideo,
                html: repeatVideo,
              },
              downloadMp4Mp3: {
                active: result.GeneralSubIsActivedownloadMp4Mp3,
                html: downloadMp4Mp3,
              },
              donwloadExternal: {
                active: result.GeneralSubIsActivedonwloadExternal,
                html: donwloadExternal,
              },
              viewExternalVideo: {
                active: result.GeneralSubIsActiveviewExternalVideo,
                html: viewExternalVideo,
              },
              pictureToPicture: {
                active: result.GeneralSubIsActivepictureToPicture,
                html: pictureToPicture,
              },
              screenShot: {
                active: result.GeneralSubIsActiveScreenShot,
                html: screenShot,
              },
            };
            for (const key in contentData) {
              if (contentData[key].active) {
                containerButtons.innerHTML += contentData[key].html;
              }
            }

            // Resto del código para formularios y eventos...
          } else {
            console.error("Elemento .containerButtons no encontrado");
          }
          // Formulario de botones para descargar
          const formulariodescarga = document.querySelector(
            ".formulariodescarga"
          );
          const formulariodescargaaudio = document.querySelector(
            ".formulariodescargaaudio"
          );
          const framedescarga = document.querySelector("#descargando");
          const framedescargamp3 = document.querySelector("#descargandomp3");
          if (formulariodescarga && formulariodescargaaudio) {
            formulariodescarga.addEventListener("click", (e) => {
              e.preventDefault();
            });
            formulariodescargaaudio.addEventListener("click", (e) => {
              e.preventDefault();
            });
          }
          const btn1mp4 = document.querySelector(".btn1");
          const btn2mp3 = document.querySelector(".btn2");
          const btn3cancel = document.querySelector(".btn3");
          const selectcalidades = document.querySelector(".selectcalidades");
          const selectcalidadesaudio = document.querySelector(
            ".selectcalidadesaudio"
          );

          selectcalidades.addEventListener("change", (e) => {
            framedescarga.src = `https://loader.to/api/button/?url=${window.location.href}&f=${e.target.value}&color=0af`;
            framedescarga.classList.remove("ocultarframe");
          });

          selectcalidadesaudio.addEventListener("change", (e) => {
            framedescargamp3.src = `https://loader.to/api/button/?url=${window.location.href}&f=${e.target.value}&color=049c16`;
            // console.log(e.target.value)
            framedescargamp3.classList.remove("ocultarframeaudio");
          });

          if (btn3cancel) {
            btn3cancel.onclick = () => {
              formulariodescarga.style.display = "none";
              formulariodescargaaudio.style.display = "none";
            };
          }

          if (btn1mp4) {
            btn1mp4.onclick = () => {
              selectcalidades.classList.remove("ocultarframe");
              framedescarga.classList.add("ocultarframe");
              formulariodescarga.classList.remove("ocultarframe");
              formulariodescarga.style.display = "";
              selectcalidadesaudio.classList.add("ocultarframeaudio");
              formulariodescargaaudio.classList.add("ocultarframe");
              formulariodescarga.reset();
            };
          }

          if (btn2mp3) {
            btn2mp3.onclick = () => {
              formulariodescargaaudio.classList.remove("ocultarframe");
              formulariodescarga.classList.add("ocultarframe");
              framedescargamp3.classList.remove("ocultarframeaudio");
              formulariodescargaaudio.style.display = "";
              selectcalidadesaudio.classList.remove("ocultarframeaudio");
              framedescargamp3.classList.add("ocultarframeaudio");
              formulariodescargaaudio.reset();
            };
          }

          const reverse = document.querySelector("#columns"); // Invertir contenido
          // const btnReset = document.querySelector("#reset"); // Reset button
          // const InputColor = document.querySelector("#color"); // Input color
          const btnImagen = document.querySelector("#imagen");
          // Download image video
          const formularioButtons = document.querySelector("#eyes"); // Filtro de pantalla
          // const btnFondo = document.querySelector("#fondo"); // Fondo cinematica completa
          const invertirVista = document.querySelector("#invertir"); // Intercambiar vista

          const buttonsVideo = document.querySelector(
            "#top-row.ytd-watch-metadata"
          ); // Botones para video

          reverse.style.flexDirection = "row";
          buttonsVideo.style =
            "display: flex;flex-direction: column;justify-content: center;align-items: center ;";
          document.querySelector("#title > h1").style =
            "text-align: center; color: red;";
          document.querySelector("#owner").style.justifyContent = "center";
          //document.querySelector("#search-icon-legacy.ytd-searchbox").style.backgroundColor = "gray";

          let countViewRow = 0; // Count
          if (invertirVista) {
            invertirVista.onclick = () => {
              countViewRow += 1;
              switch (countViewRow) {
                case 1:
                  reverse.style.flexDirection = "row-reverse";
                  break;
                case 2:
                  reverse.style.flexDirection = "row";
                  countViewRow = 0;
                  break;
              }
            };
          }

          // valido modo oscuro y venta de video
          // Repeat video button
          let countRepeat = 0; // count
          const repeat = document.querySelector("#repeatvideo"); // Repeat button
          const imarepeat = document.querySelector(".icon-tabler-repeat"); // img repeat
          const videoFull = document.querySelector(
            "#movie_player > div.html5-video-container > video"
          );
          repeat.onclick = () => {
            if (
              document.querySelector("#cinematics > div") != undefined ||
              videoFull != undefined
            ) {
              countRepeat += 1;
              setInterval(() => {
                switch (countRepeat) {
                  case 1:
                    document
                      .querySelector(
                        "#movie_player > div.html5-video-container > video"
                      )
                      .setAttribute("loop", "true");
                    imarepeat.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M4 12v-3c0 -1.336 .873 -2.468 2.08 -2.856m3.92 -.144h10m-3 -3l3 3l-3 3"></path>
                      <path d="M20 12v3a3 3 0 0 1 -.133 .886m-1.99 1.984a3 3 0 0 1 -.877 .13h-13m3 3l-3 -3l3 -3"></path>
                      <path d="M3 3l18 18"></path>
                   </svg> `; // img repeat
                    break;
                  case 2:
                    countRepeat = 0;
                    document
                      .querySelector(
                        "#movie_player > div.html5-video-container > video"
                      )
                      .removeAttribute("loop");
                    imarepeat.innerHTML = ` <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat" width="24"
                      height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                      stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
                      <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
                    </svg>`;
                    break;
                }
              }, 1000);
            } else {
              mostrarAlerta("Active Dark Theme in Youtube page");
            }
          };
          // Background transparent
          reverse.style.flexDirection = "row";

          if (btnImagen) {
            btnImagen.onclick = () => {
              if (
                document.querySelector("#cinematics > div") != undefined ||
                videoFull != undefined
              ) {
                const parametrosURL = new URLSearchParams(
                  window.location.search
                );
                let enlace = parametrosURL.get("v");

                // Construir la URL de la imagen
                const imageUrl = `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`;

                // Realizar la solicitud para obtener la imagen
                fetch(imageUrl)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.blob();
                  })
                  .then((blob) => {
                    // Obtener el tamaño de la imagen en kilobytes
                    const imageSizeKB = blob.size / 1024;

                    // Verificar si el tamaño de la imagen es menor o igual a 20 KB
                    if (imageSizeKB >= 20) {
                      window.open(
                        `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`,
                        "popUpWindow",
                        "height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
                      );
                      // Crear una URL para la imagen
                      const imageUrlObject = URL.createObjectURL(blob);

                      // Crear un enlace para descargar la imagen
                      const enlaceDescarga = document.createElement("a");
                      enlaceDescarga.href = imageUrlObject;
                      const titleVideo = document.querySelector(
                        "h1.style-scope.ytd-watch-metadata"
                      ).innerText;
                      enlaceDescarga.download = `${titleVideo}_maxresdefault.jpg`;

                      // Simular un clic en el enlace para iniciar la descarga
                      enlaceDescarga.click();

                      // Limpiar la URL del objeto después de la descarga
                      URL.revokeObjectURL(imageUrlObject);
                    } else {
                      console.log(
                        "La imagen excede los 20 KB. No se descargará."
                      );
                      // Puedes mostrar un mensaje de error o tomar otra acción según tus necesidades
                    }
                  })
                  .catch((error) => {
                    console.error("Error al obtener la imagen:", error);
                    // Puedes manejar el error según tus necesidades
                  });
              } else {
                mostrarAlerta("Active Dark Theme in Youtube page");
              }
            };
          }

          const externalLink = document.querySelector(".external_link");
          if (externalLink) {
            externalLink.onclick = () => {
              const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
              let enlace;
              enlace = parametrosURL.get("v");
              window.open(
                `https://www.y2mate.com/es/convert-youtube/${enlace}`,
                "popUpWindow",
                "height=800,width=1000,left=50%,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=yes,location=no,directories=yes, status=no"
              );
            };
          }
          const viewExternalLink = document.querySelector(
            ".view_external_link"
          );
          if (viewExternalLink) {
            viewExternalLink.onclick = () => {
              document.querySelector("video").click();
              const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
              let enlace;
              enlace = parametrosURL.get("v");
              window.open(
                `https://www.youtube.com/embed/${enlace}?rel=0&controls=2&color=yellow&iv_load_policy=3&showinfo=0&modestbranding=1&autoplay=1`
              );
            };
          }
          const viewPictureToPicture = document.querySelector(
            ".video_picture_to_picture"
          );
          if (viewPictureToPicture) {
            viewPictureToPicture.onclick = () => {
              const video = document.querySelector("video");
              // Verifica si el navegador admite Picture-in-Picture
              if ("pictureInPictureEnabled" in document) {
                // Verifica si el video aún no está en modo Picture-in-Picture
                if (!document.pictureInPictureElement) {
                  // Intenta activar el modo Picture-in-Picture
                  video
                    .requestPictureInPicture()
                    .then(() => {
                      // El video está ahora en modo Picture-in-Picture
                    })
                    .catch((error) => {
                      console.error(
                        "Error al activar el modo Picture-in-Picture:",
                        error
                      );
                    });
                } else {
                  // El video ya está en modo Picture-in-Picture, puedes manejarlo según tus necesidades
                }
              } else {
                console.error(
                  "El modo Picture-in-Picture no está soportado en este navegador."
                );
              }
            };

            // Filtro de pantalla
            if (formularioButtons) {
              formularioButtons.addEventListener("input", function () {
                if (
                  document.querySelector("#cinematics > div") != undefined ||
                  videoFull != undefined
                ) {
                  document.querySelector("#ojosprotect").style.backgroundColor =
                    formularioButtons.value;
                }
              });
            }
            clearInterval(renderizarContenido);
          }

          const screenShotVideo = document.querySelector(".screenshot_video");
          if (screenShotVideo) {
            screenShotVideo.onclick = () => {
              const video = document.querySelector("video");
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const context = canvas.getContext("2d");
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imagenURL = canvas.toDataURL("image/png");
              const enlaceDescarga = document.createElement("a");
              enlaceDescarga.href = imagenURL;
              const titleVideo = document.querySelector(
                "h1.style-scope.ytd-watch-metadata"
              ).innerText;
              enlaceDescarga.download = `${video.currentTime.toFixed(
                0
              )}s_${titleVideo}.png`;
              enlaceDescarga.click();
            };
          } else {
            // Si result.GeneralIsActiveIconColor es falso, quitar contenido del DOM
            const containerButtons =
              document.querySelector(".containerButtons");

            if (containerButtons != undefined) {
              containerButtons.innerHTML = "";
              // También puedes ocultar o manipular otros elementos según tus necesidades
            }
          }
          clearInterval(renderizarContenido);
        }
      });
    }
    renderizarContenido();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (const key in changes) {
        if (namespace === "local" && key.startsWith("GeneralSub")) {
          renderizarContenido();
          break;
        }
      }
    });

    // Función para link github project
    const existeFormButton = document.querySelector(
      "#below > ytd-watch-metadata > div.container > form"
    );

    function MDCM() {
      if (!existeFormButton) {
        const mdcm = document.querySelector("#MDCM");
        const sms = document.querySelector("#below > ytd-watch-metadata");
        if (!mdcm) {
          if (sms != undefined) {
            const mdcm = document.createElement("P");
            mdcm.innerHTML =
              '<a id="MDCM" target="_blank" style="margin: 10px 0; font-size: 14px; color: #24ff; text-decoration: none; display: flex; align-items: center; justify-content: center; font-style: italic;font-weight: 700;" href="https://github.com/DeveloperMDCM/Youtube-tools-extension">Link GitHub Repository<h4></h4</a>';
            sms.appendChild(mdcm);
          }
        }
      }
    }
    // Función para adaptar dislikes
    // Función para formatear los dislikes
    function FormatiarNumero(num, digits) {
      const lookup = [
        {
          value: 1,
          symbol: "",
        },
        {
          value: 1e3,
          symbol: " K",
        },
        {
          value: 1e6,
          symbol: " M",
        },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const item = lookup
        .slice()
        .reverse()
        .find((item) => {
          return num >= item.value;
        });
      return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
    }

    let validoUrl = document.location.href;

    async function videoDislike() {
      validoUrl = document.location.href;

      const validoVentana = document.querySelector(
        "#below > ytd-watch-metadata > div.container > form > div.containerButtons"
      );
      if (
        validoVentana != undefined &&
        document.location.href.split("?v=")[0].includes("youtube.com/watch")
      ) {
        validoUrl = paramsVideoURL();
        const urlShorts = `https://returnyoutubedislikeapi.com/Votes?videoId=${validoUrl}`;
        try {
          const respuesta = await fetch(urlShorts);
          const datosShort = await respuesta.json();
          const { dislikes } = datosShort;
          // alert(dislikes, 'Video')
          document.querySelector(
            "#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button"
          ).style = "width: 90px";
          // document.querySelector('#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button > yt-touch-feedback-shape > div').insertAdjacentHTML("beforebegin", `${FormatiarNumero(dislikes, 0)}`);
          document.querySelector(
            "#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button"
          ).innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" /></svg>
          ${FormatiarNumero(dislikes, 0)}`;
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Función para mostrar los dislikes en shorts
    async function shortDislike() {
      validoUrl = document.location.href;
      const validoVentanaShort = document.querySelectorAll(
        "#dislike-button > yt-button-shape > label > div > span"
      );
      if (
        validoVentanaShort != undefined &&
        document.location.href.split("/")[3] === "shorts"
      ) {
        validoUrl = document.location.href.split("/")[4];
        const urlShorts = `https://returnyoutubedislikeapi.com/Votes?videoId=${validoUrl}`;
        try {
          const respuesta = await fetch(urlShorts);
          const datosShort = await respuesta.json();
          const { dislikes } = datosShort;
          for (var i = 0; i < validoVentanaShort.length; i++) {
            validoVentanaShort[i].textContent = `${FormatiarNumero(
              dislikes,
              0
            )}`;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Mostrar alerta de activar modo oscuro
    function mostrarAlerta(mensaje) {
      alert("Active Dark Theme in Youtube page");
      const addButton = document.querySelector(
        "#below > ytd-watch-metadata > div.container > form"
      );
      const existeAlerta = document.querySelector(".alerta");
      if (!existeAlerta) {
        if (addButton != undefined) {
          const modeDark = document.createElement("P");
          modeDark.innerHTML = `<h1 class="alerta" style="color: red; background-color: white; border: 2px solid white; text-aling: center; display: flex;  align-items: center; justify-content: center;">${mensaje}</h1>`;
          addButton.appendChild(modeDark);
          setTimeout(() => {
            modeDark.remove();
          }, 7000);
        }
      }
    }
    // Función para eliminar los posibles anuncios
    function eliminarAnuancios() {
      // Skip ads video / saltar publicidad
      if (
        document.querySelector(".ytp-ad-skip-button-modern.ytp-button") !==
          null ||
        document.querySelector(
          ".ytp-ad-text.ytp-ad-preview-text-modern" !== null
        ) ||
        document.querySelector(".ytp-ad-preview-container" !== null)
      ) {
        document.querySelector(
          "#movie_player > div.html5-video-container > video"
        ).currentTime = 100000;
        document.querySelector(".ytp-ad-skip-button-modern.ytp-button").click();
        document.querySelector(".video-ads.ytp-ad-module").click();
      }
      const buttonSkip = document.querySelector(
        ".ytp-ad-skip-button.ytp-button"
      );
      const validar = undefined;
      let bannerAds = document.querySelector(
        ".ytd-banner-promo-renderer-background"
      );
      let bannerProm = document.querySelector("#simple-ad-badge");
      let ytpminiplayerscrim = document.querySelector("ytp-miniplayer-scrim");
      let cross = document.getElementsByClassName(
        "ytp-ad-overlay-close-container"
      )[0];
      let skip = document.getElementsByClassName("ytp-ad-skip-button")[0];
      let ad1 = document.querySelector(
        "#contents > ytd-promoted-sparkles-web-renderer"
      );
      let ad2 = document.querySelector(
        "#player-ads > ytd-player-legacy-desktop-watch-ads-renderer"
      );
      let ad3 = document.querySelector("#action-companion-click-target");
      let ad4 = document.querySelector(
        "#player-overlay\\:0 > div.ytp-ad-player-overlay-flyout-cta.ytp-ad-player-overlay-flyout-cta-rounded"
      );
      let ad5 = document.querySelector(
        "#invideo-overlay\\:0 > div > div.ytp-ad-image-overlay"
      );
      let ad6 = document.querySelector("#root");
      let ad7 = document.querySelector(
        "#rendering-content > ytd-video-masthead-ad-v3-renderer"
      );
      let ad8 = document.querySelector(
        "#player-ads > ytd-player-legacy-desktop-watch-ads-renderer"
      );
      let ad9 = document.querySelector(".ytp-ad-text-overlay");
      const adVideo = document.querySelectorAll(".ad-showing")[0];
      const adTimeVideo = document.querySelector(
        ".ytp-ad-text.ytp-ad-preview-text"
      );
      const video = document.querySelector("video");
      if (adVideo != validar && video != validar && adTimeVideo != validar) {
        video.currentTime = video.duration;
      }
      if (ytpminiplayerscrim != validar) alert("eliminado");
      if (ad1 != validar) ad1.remove();
      if (ad2 != validar) ad2.remove();
      if (ad3 != validar) ad3.remove();
      if (ad4 != validar) ad4.remove();
      if (ad5 != validar) ad5.remove();
      if (ad6 != validar && ad) {
        ad6.style.display = "none";
        ad = false;
      }
      if (ad7 != validar) ad7.remove();
      if (ad8 != validar) ad8.remove();
      if (ad9 != validar) ad9.remove();
      if (bannerAds != validar) bannerAds.remove();
      if (bannerProm != validar) bannerProm.remove();
      if (cross != validar) cross.click();
      if (skip != validar) skip.click();
      if (buttonSkip != validar) {
        buttonSkip.click();
      }
    }

    // Validar que la url a cambiado por una nueva
    let prevUrl = undefined; // Sin cambios
    setInterval(async () => {
      // URL changed / Cambio
      const currUrl2 = window.location.href;
      const video = document.querySelector(
        "#below > ytd-watch-metadata > div.container > form > div.containerButtons"
      );

      if (currUrl2 != prevUrl && video != undefined) {
        setTimeout(() => {
          videoDislike();
        }, 2000);
      }
      const currUrl = window.location.href;
      if (currUrl != prevUrl) {
        MDCM();
        setTimeout(() => {
          shortDislike();
        }, 1000);
        const formulariodescarga = document.querySelector(
          ".formulariodescarga"
        );
        const formulariodescargaaudio = document.querySelector(
          ".formulariodescargaaudio"
        );
        setTimeout(() => {
          if (formulariodescarga != undefined) {
            formulariodescarga.classList.add("ocultarframe");
            formulariodescargaaudio.classList.add("ocultarframe");
          }
        }, 500);
        prevUrl = currUrl;
      }

      const ventanaShortComentarios = document.querySelector(
        "body > ytd-app > ytd-popup-container > tp-yt-paper-dialog > ytd-engagement-panel-section-list-renderer"
      );
      const historias = document.querySelectorAll("#shorts-inner-container");
      if (ventanaShortComentarios && historias) {
        limpiarHTML();
      }
      eliminarAnuancios();
    }, 500); // Cada 2 segundos se ejecuta mientras la url cambie
    eliminarAnuancios();
  }

  // Variables para la traduccion de comentarios
  let traducido; // Texto traducido
  let urlLista; // Url lista
  //TODO: Traducir comentarios
  async function traductor() {
    const texto = document.querySelectorAll("#content-text");
    let o = `?client=dict-chrome-ex&sl=auto&tl=${navigator.language}&q=`;
    for (let i = 0; i < texto.length; i++) {
      const botonTraducir = document.createElement("BUTTON");
      botonTraducir.classList.add("mdcm");
      botonTraducir.textContent = "Traducir";
      botonTraducir.style.backgroundColor = "white";
      botonTraducir.style.color = "black";
      botonTraducir.style.borderRadius = "5px";
      botonTraducir.setAttribute("id", `btn${i}`);
      texto[i].insertAdjacentElement("afterend", botonTraducir);
      const mdcm = document.querySelectorAll(`.mdcm`);
      mdcm[i].onclick = function () {
        traducido = o;
        urlLista = traducido + texto[i].textContent;
        fetch("https://translate.googleapis.com/translate_a/t" + urlLista) //API
          .then((response) => response.json())
          .then((datos) => {
            texto[i].textContent = datos[0][0];
            mdcm[i].textContent = "Translated";
          });
      };
    }
  }

  // Limpiar botones de comentarios
  function limpiarHTML() {
    const buttons = document.querySelectorAll(".mdcm");
    [].forEach.call(buttons, function (buttons) {
      buttons.remove();
    });
    traductor();
  }

  // TODO: mostrar boton de traducir en comentarios cuando sean visibles
  window.onscroll = () => {
    const divEl = document.querySelector("#content-text");
    if (divEl != undefined) {
      limpiarHTML();
    }
  };
  setTimeout(() => {
    cargarScript();
  }, 2000);
})();
