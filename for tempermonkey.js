// ==UserScript==
// @name         Youtube Tools opciones extras
// @namespace    https://github.com/DeveloperMDCM/
// @homepage     https://github.com/DeveloperMDCM/
// @version      5.0
// @description  Nuevas opciones para modificar la interfaz de YouTube y más  options to customize youtube @MDCM2022
// @author       MDCM
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @downloadURL  https://github.com/DeveloperMDCM/
// @updateURL    https://github.com/DeveloperMDCM/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @connect      youtube.com
// ==/UserScript==

(function () {
    // Youtube tools by: DeveloperMDCM MDCM
// https://github.com/DeveloperMDCM/Youtube-toos-extension
// API return dislikes  https://returnyoutubedislike.com/

window.addEventListener('DOMContentLoaded', cargarScript());
function cargarScript() {
  console.log('Scrip en ejecución by: DeveloperMDCM  MDCM');
  // alert('https://github.com/DeveloperMDCM/Youtube-toos-extension');
  let urlEnlace = '';
  let verificar = true;
  let ad = true;
  const addDislike = document.createElement('P');
  const menuBotones = `
  <style>
  #subscribe-button > ytd-subscribe-button-renderer > yt-button-shape > button:hover {
    zoom: 0.9;
  }
    .containerButtons {
      position: relative;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      user-select: none;
    }

    .containerButtons button , input {
      display: flex;
      flex-direction: column-reverse;
      margin: 0 4px;
      align-items: center;
      cursor: pointer;
      border-radius: 10px;

    }
    .containerButtons h1, h2 {
      user-select: none;
    }

    #MDCM {
      animation: mdcm 10s infinite alternate;
      position: relative;
      transition: 4s;
    }

    @keyframes mdcm {
      0%, 100%{
        right: 300px;
      }
      50% {
        right: -300px;
      }
    }

    .containerButtons button .containerButtons button svg {
      width: 50px;
      height: 40px;
    }

    #color {
      opacity:0;position:absolute;height: 93%;bottom: 0; top: 2px; width: 62px;
    }
  </style>
  <div id="cargando" class="hidden">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  </div>
  <div class="container">
    <form>
      <div class="containerButtons">
        <div style="position:relative; display:inline-block ">
        <button type="button" class="btn btn-secondary"><img width="35" src="https://cdn-icons-png.flaticon.com/512/674/674468.png"><input id="color" list type="color" value="#ffffff" ></button></div>
        <button type="button" class="btn btn-warning" id="guardar"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/6984/6984759.png"></button>
        <button type="button" class="btn btn-success" id="imagen"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/3342/3342119.png"></button>
        <button type="button" class="btn btn-success" id="enlace"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/4063/4063869.png"></button>
        <button type="button" class="btn btn-light" id="boton"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/817/817711.png"></button>
        <button type="button" class="btn btn-light" id="fondo"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/4789/4789442.png"></button>
        <button type="button" class="btn btn-info" id="reset"> <img width="35" src="https://cdn-icons-png.flaticon.com/512/5632/5632370.png"></button>
      </div>
        <div>
        </div>
        <h1 id="rating" style="text-align: center;  margin: 5px 0">⭐</h1>
        <h2 style="text-align: center; margin: 5px 0" id="ratingtext" >Rating</h2>
    </form>
</div>
  `;



  setInterval(() => {

      const addButton = document.querySelector(".style-scope .ytd-watch-metadata");
      if (addButton != undefined && verificar) {
          addButton.insertAdjacentHTML('beforebegin', menuBotones);
          verificar = false;
          document.querySelector('video').style.borderRadius = '30px';
      const reverse = document.querySelector("#columns");
      const btnReset = document.querySelector('#reset');
      const descarga = document.querySelector('#enlace');
      const btnGuardar = document.querySelector('#guardar');
      const InputColor = document.querySelector('#color');
      const btnImagen = document.querySelector('#imagen');
      const btnFondo = document.querySelector('#fondo');
      const boton = document.querySelector('#boton');
      const buttonsVideo = document.querySelector('#top-row.ytd-watch-metadata');
        reverse.style.flexDirection = 'row';
          buttonsVideo.style = '    display: flex;flex-direction: column;justify-content: center;align-items: center ;';
          document.querySelector("#title > h1").style = 'text-align: center; color: red;';
          document.querySelector("#owner").style.justifyContent = 'center';
          document.querySelector('#search-icon-legacy.ytd-searchbox').style.backgroundColor = 'black';
      btnFondo.onclick = function () {
        if( document.querySelector("#cinematics > div") != undefined){
          document.querySelector("#cinematics > div").style = 'position: fixed; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
          document.querySelector("#cinematics > div > canvas:nth-child(1)").style = 'position: absolute; width: 100%; height: 100%;';
          document.querySelector("#cinematics > div > canvas:nth-child(2)").style = 'position: absolute; width: 100%; height: 100%; opacity: 0.4;';
          document.querySelector("html[dark] [dark]").style.backgroundColor = 'transparent';
          document.body.style.setProperty('--yt-spec-general-background-a', 'transparent');
          document.querySelector("ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer").style = "border: 3px solid red; background-color: #352e2e29";
          // document.querySelector('ytd-watch-flexy[flexy][is-two-columns_][is-extra-wide-video_] #primary.ytd-watch-flexy, ytd-watch-flexy[flexy][is-two-columns_][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy').style.backgroundColor = '#303030ab';

        }else {
          mostrarAlerta('Active Dark Theme');
          }
      };

      descarga.onclick = function() {
        let enlace;
        enlace = document.baseURI;
        urlEnlace = enlace.split('=')[1].split('&')[0];
        window.open(`https://www.y2mate.com/youtube/${urlEnlace}`, '_blank');
        // console.log(urlEnlace);
      }
      let count = 1;
      boton.onclick = function() {
        if (count === 1 && reverse != undefined) {
          count = 2;
          reverse.style.flexDirection = 'row-reverse';
        } else {
          reverse.style.flexDirection = 'row';
          count = 1;
        }
      };

      btnGuardar.onclick = function () {
        if(document.querySelector("#cinematics > div") != undefined){
          document.body.style.setProperty('--yt-spec-text-primary', InputColor.value);
          document.body.style.setProperty('--yt-spec-static-overlay-background-brand', 'red');
          document.body.style.setProperty('--yt-spec-static-brand-red', InputColor.value);
          document.body.style.setProperty('--yt-spec-static-brand-white', InputColor.value);
          document.body.style.setProperty('--ytd-searchbox-legacy-border-color', InputColor.value);
          document.body.style.setProperty('--ytd-searchbox-legacy-border-shadow-color', InputColor.value);
          document.querySelector("#logo-icon").style.color = InputColor.value;
          document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > yt-button-shape > button").style = 'color: black; background-color: white; border: 2px solid black; ';

        }else {
          mostrarAlerta('Active Dark Theme');
        }
      };
      btnReset.onclick = function() {
        if(document.querySelector("#cinematics > div") != undefined){

        document.body.style.setProperty('--yt-spec-text-primary', '#ffffff');
        // document.body.style.setProperty('--yt-spec-text-secondary', '#ffffff');
        document.body.style.setProperty('--yt-spec-static-overlay-background-brand', '#ffffff');
        document.querySelector("#cinematics > div").style = 'position: relative; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
        document.body.style.setProperty('--yt-spec-static-overlay-background-brand', 'red');
        document.body.style.setProperty('--yt-spec-static-brand-red', '#ff0000');
        document.body.style.setProperty('--yt-spec-static-brand-white', 'gray');
        document.body.style.setProperty('--ytd-searchbox-legacy-border-color', '#ffffff');
        document.body.style.setProperty('--ytd-searchbox-legacy-border-shadow-color', '#ffffff');
        document.querySelector("#logo-icon").style.color = '#ffffff';
        document.body.style.setProperty('--yt-spec-general-background-a', '#000000');
        document.querySelector("html[dark] [dark]").style.backgroundColor = '#000000';
        document.querySelector("ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer").style = "";
        }else {
          mostrarAlerta('Active Dark Theme');
        }
        reverse.style.flexDirection = 'row';
      };
      //
      btnImagen.onclick = function () {
        let enlace;
        enlace = document.baseURI.split('=')[1].split('&')[0];
        window.open(`https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`, '_blank');
      };
      if(document.querySelector('#below > ytd-watch-metadata > div.container > form') != undefined){
        const mdcm = document.querySelector('#MDCM');
        const sms = document.querySelector('#below > ytd-watch-metadata > div.container > form');
        if(!mdcm) {
          if (sms != undefined) {
            const mdcm = document.createElement('P');
            mdcm.innerHTML = '<a id="MDCM" target="_blank" style="font-size: 14px; color: #0737e6;text-decoration-style: wavy; display: flex; align-items: center; justify-content: center;" href="https://github.com/DeveloperMDCM/Youtube-toos-extension">GitHub Repository<h4></h4</a>';
            sms.appendChild(mdcm);
        }
      }
    }
      }

  }, 100);



  function cargarDislikes() {
    const btnDislike = document.querySelector("#segmented-dislike-button yt-button-shape > button");
    const resultado = document.querySelector("#segmented-dislike-button > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape");
    let enlace = document.baseURI.split('=')[0];
    if (enlace != 'https://www.youtube.com/') {
      enlace = document.baseURI.split('=')[1].split('&')[0];
      const url = `https://returnyoutubedislikeapi.com/Votes?videoId=${enlace}`;
      fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
          const Formatter = (num, digits) => {
            const lookup = [{
                value: 1,
                symbol: ""
              },
              {
                value: 1e3,
                symbol: " K"
              },
              {
                value: 1e6,
                symbol: " M"
              }
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            const item = lookup.slice().reverse().find((item) => {
              return num >= item.value
            })
            return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0"
          }
          const {dislikes, dateCreated, rating } = datos; // Objeto
          addDislike.textContent = `${Formatter(dislikes, 0)}`;
          btnDislike.style = 'width: 100px';
          resultado.style = 'margin: 0 6px';
          resultado.insertAdjacentElement('afterend', addDislike);

          document.querySelector("#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-animated-icon").innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
            </svg>`;
          document.querySelector("#segmented-dislike-button > ytd-toggle-button-renderer > yt-button-shape > button > div > yt-icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
          </svg>
          `;

          let start = rating;
          const startRating = document.querySelector("#below > ytd-watch-metadata > div.container > form > h1");
          const ratingtext = document.querySelector("#ratingtext");
          const date = new Date();
          limpiarHTML(startRating);
          for (let i = 1; i <= Math.round(start); i++) {
            startRating.textContent += '⭐';
            ratingtext.innerHTML = `Rating <br>${dateCreated.split('T')[0].split('-')[0]} - ${date.getFullYear()}` ;
            // console.log(start);
          }
      })
    }

  }


  function limpiarHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  function mostrarAlerta(mensaje) {
    const addButton = document.querySelector('#below > ytd-watch-metadata > div.container > form');
    const existeAlerta = document.querySelector('.alerta');
    if(!existeAlerta) {
      if (addButton != undefined) {
        const modeDark = document.createElement('P');
        modeDark.innerHTML = `
        <h1 class="alerta" style="color: red; background-color: white; border: 2px solid white; text-aling: center; display: flex;  align-items: center; justify-content: center;">${mensaje}</h1>
        `;
        addButton.appendChild(modeDark);
      setTimeout(() =>{
        modeDark.remove();
      }, 3000)
    }

  }
  }

  function eliminarAnuancios() { // Skip ads video / saltar publicidad
      const buttonSkip = document.querySelector('.ytp-ad-skip-button.ytp-button');
      const validar = undefined;
      let cross = document.getElementsByClassName("ytp-ad-overlay-close-container")[0];
      let skip = document.getElementsByClassName("ytp-ad-skip-button")[0];
      let ad1 = document.querySelector("#contents > ytd-promoted-sparkles-web-renderer")
      let ad2 = document.querySelector("#player-ads > ytd-player-legacy-desktop-watch-ads-renderer");
      let ad3 = document.querySelector("#action-companion-click-target");
      let ad4 = document.querySelector("#player-overlay\\:0 > div.ytp-ad-player-overlay-flyout-cta.ytp-ad-player-overlay-flyout-cta-rounded");
      let ad5 = document.querySelector("#invideo-overlay\\:0 > div > div.ytp-ad-image-overlay");
      let ad6 = document.querySelector("#contents > ytd-rich-item-renderer:nth-child(1)");
      let ad7 = document.querySelector("#rendering-content > ytd-video-masthead-ad-v3-renderer");
      let ad8 = document.querySelector("#player-ads > ytd-player-legacy-desktop-watch-ads-renderer");
      let ad9 = document.querySelector('.ytp-ad-text-overlay');
      const adVideo = document.querySelectorAll('.ad-showing')[0];
      const adTimeVideo = document.querySelector('.ytp-ad-text.ytp-ad-preview-text');
      const video = document.querySelector('video');
      if (adVideo != validar && video != validar && adTimeVideo != validar) {
          video.currentTime = video.duration;
      }
      if (ad1 != validar) ad1.remove();
      if (ad2 != validar) ad2.remove();
      if (ad3 != validar) ad3.remove();
      if (ad4 != validar) ad4.remove();
      if (ad5 != validar) ad5.remove();
      if (ad6 != validar && ad) {
          ad6.style.display = 'none';
          ad = false;
      }
      if (ad7 != validar) ad7.remove();
      if (ad8 != validar) ad8.remove();
      if (ad9 != validar) ad9.remove();
      if (cross != validar) cross.click();
      if (skip != validar) skip.click();
          if (buttonSkip != validar) {
            buttonSkip.textContent = 'MDCM';
            buttonSkip.click();
          }
      }
      function checkURLchange(){
        eliminarAnuancios();
      cargarDislikes();
  }


  setInterval(checkURLchange, 100); // Ejecutame esta funcion
  clearInterval(checkURLchange);
}


})();
