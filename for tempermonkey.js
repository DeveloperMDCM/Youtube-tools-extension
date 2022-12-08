// ==UserScript==
// @name         Youtube Tools
// @namespace    https://github.com/DeveloperMDCM/
// @version      0.3
// @description  New options to customize youtube @MDCM2022
// @author       MDCM
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    let enlace = '';
let urlEnlace = '';

let ad = true;
let btnReady = true;
let verificar = true;
const addDislike = document.createElement('p');
let menuBotones = `
        <div class="container">
        <form>
        <div style="position:relative; display:inline-block ">
        <button type="button" class="btn btn-secondary"><img width="35" src="https://cdn.icon-icons.com/icons2/624/PNG/512/RGB_Circle_1-80_icon-icons.com_57282.png"><input id="color" type="color" value="#fff" style="opacity:0;position:absolute;left: 0;top:0;width: 100%;height: 100%;"></button></div>
        <button type="button" class="btn btn-success" id="imagen"> <img width="35" src="https://cdn.icon-icons.com/icons2/1603/PNG/512/photo-photography-image-picture_108525.png"></button>
        <button type="button" class="btn btn-success" id="enlace"> <img width="35" src="https://cdn.icon-icons.com/icons2/3456/PNG/512/download_folder_file_icon_219533.png"></button>
        <button type="button" class="btn btn-warning" id="guardar"> <img width="35" src="https://cdn.icon-icons.com/icons2/368/PNG/512/Save-as_37111.png"></button>
        <button type="button" class="btn btn-light" id="boton"> <img width="35" src="https://cdn.icon-icons.com/icons2/2104/PNG/512/arrows_icon_129140.png"></button>
        <button type="button" class="btn btn-light" id="fondo"> <img width="35" src="https://cdn.icon-icons.com/icons2/1451/PNG/512/videofolder_99361.png"></button>
        <button type="button" class="btn btn-info" id="reset"> <img width="35" src="https://cdn.icon-icons.com/icons2/1496/PNG/512/systemreboot_103403.png"></button>
        </form>
        </div>`;

setInterval(function () {
    const addButton = document.querySelector(".style-scope .ytd-watch-metadata");
    if (addButton != undefined && verificar) {
        addButton.insertAdjacentHTML('beforebegin', menuBotones);
        verificar = false;
        const reverse = document.querySelector("ytd-watch-flexy[flexy][is-two-columns_] #columns.ytd-watch-flexy");
        const btnReset = document.querySelector('#reset');
        const descarga = document.querySelector('#enlace');
        const btnGuardar = document.querySelector('#guardar');
        const InputColor = document.querySelector('#color');
        const btnImagen = document.querySelector('#imagen');
        const btnFondo = document.querySelector('#fondo');
        const buttonsVideo = document.querySelector('#top-row.ytd-watch-metadata');
        btnFondo.addEventListener('click', function () {
            document.querySelector("#cinematics > div").style = 'position: fixed; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
            document.querySelector("#cinematics > div > canvas:nth-child(1)").style = 'position: absolute; width: 100%; height: 100%;';
            document.querySelector("#cinematics > div > canvas:nth-child(2)").style = 'position: absolute; width: 100%; height: 100%; opacity: 0.4;';
            document.body.style.setProperty('--yt-spec-general-background-a', 'transparent');
            document.querySelector("html[dark] [dark]").style.backgroundColor = 'transparent';
            document.querySelector("ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer").style = "border: 3px solid red; background-color: #00000077";
        });
        descarga.addEventListener('click', (e) => {
            e.preventDefault();
            enlace = document.baseURI;
            urlEnlace = enlace.split('=')[1].split('&')[0];
            window.open(`https://www.y2mate.com/youtube/${urlEnlace}`, '_blank');
        });

        let count = 1;
        document.querySelector('#boton').addEventListener('click', function (e) {
            e.preventDefault();
            if (count === 1) {
                count = 2;
                reverse.style.flexDirection = 'row-reverse';
                buttonsVideo.style.display = 'grid';
            } else {
                reverse.style.flexDirection = 'row';
                buttonsVideo.style.display = 'flex';
                count = 1;
            }
            return count;
        });

        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.setProperty('--yt-spec-text-primary', InputColor.value);
            //document.body.style.setProperty('--yt-spec-text-secondary', 'red');
            document.body.style.setProperty('--yt-spec-static-overlay-background-brand', 'red');
            document.body.style.setProperty('--yt-spec-static-brand-red', InputColor.value);
            document.body.style.setProperty('--yt-spec-static-brand-white', InputColor.value);
            document.body.style.setProperty('--ytd-searchbox-legacy-border-color', InputColor.value);
            document.body.style.setProperty('--ytd-searchbox-legacy-border-shadow-color', InputColor.value);
            document.querySelector("#logo-icon").style.color = InputColor.value;
            //document.querySelector("ytd-app[darker-dark-theme]").style.backgroundColor = 'green';
            //document.querySelector("html[dark] [dark]").style.backgroundColor = 'transparent';
            //document.body.style.setProperty('--app-drawer-content-container-background-color', 'green');
            //document.body.style.setProperty('--yt-spec-general-background-a', 'transparent');
        });

        btnReset.addEventListener('click', function (e) {
            e.preventDefault();
            buttonsVideo.style.display = 'flex';
            reverse.style.flexDirection = 'row';
            document.body.style.setProperty('--yt-spec-text-primary', '#fff');
            // document.body.style.setProperty('--yt-spec-text-secondary', '#fff');
            document.body.style.setProperty('--yt-spec-static-overlay-background-brand', '#fff');
            document.querySelector("#cinematics > div").style = 'position: relative; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
            document.body.style.setProperty('--yt-spec-static-overlay-background-brand', 'red');
            document.body.style.setProperty('--yt-spec-static-brand-red', '#f00');
            document.body.style.setProperty('--yt-spec-static-brand-white', 'gray');
            document.body.style.setProperty('--ytd-searchbox-legacy-border-color', '#fff');
            document.body.style.setProperty('--ytd-searchbox-legacy-border-shadow-color', '#fff');
            buttonsVideo.style.flexDirection = 'inline';
            document.body.style.setProperty('--yt-spec-general-background-a', '#000');
            document.querySelector("html[dark] [dark]").style.backgroundColor = '#000';
            document.querySelector("ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer").style = "";
        });
        //
        btnImagen.addEventListener('click', (e) => {
            e.preventDefault();
            enlace = document.baseURI.split('=')[1].split('&')[0];
            window.open(`https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`, '_blank');
        });
    }
//Skip add || saltar publicidad
    const btnDislike = document.querySelector("#segmented-dislike-button yt-button-shape > button");
    const btnDislikeMargin = document.querySelector("#segmented-dislike-button > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape");
    if (btnDislike != undefined && btnDislikeMargin != undefined && btnReady) {
        btnDislike.style = 'width: 100px';
        btnDislikeMargin.style = 'margin: 0 4px';
        document.querySelector("#segmented-dislike-button > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape").insertAdjacentElement('afterend', addDislike);
    }
    let cross = document.getElementsByClassName("ytp-ad-overlay-close-container")[0];
    let skip = document.getElementsByClassName("ytp-ad-skip-button")[0];
    let ad1 = document.querySelector("#contents > ytd-promoted-sparkles-web-renderer")
    let ad2 = document.querySelector("#player-ads > ytd-player-legacy-desktop-watch-ads-renderer");
    let ad3 = document.querySelector("#action-companion-click-target");
    let ad4 = document.querySelector("#player-overlay\\:0 > div.ytp-ad-player-overlay-flyout-cta.ytp-ad-player-overlay-flyout-cta-rounded");
    let ad5 = document.querySelector("#invideo-overlay\\:0 > div > div.ytp-ad-image-overlay");
    let ad6 = document.querySelector("#contents > ytd-rich-item-renderer:nth-child(1)");
    let ad7 = document.querySelector("#rendering-content > ytd-video-masthead-ad-v3-renderer");
    const adVideo = document.querySelectorAll('.ad-showing')[0];
    if (adVideo != undefined) {
        console.log('Eliminando anuncios')
        const video = document.querySelector('video');
        video.currentTime = video.duration;
    }
    if (ad1 != undefined) ad1.remove();
    if (ad2 != undefined) ad2.remove();
    if (ad3 != undefined) ad3.remove();
    if (ad4 != undefined) ad4.remove();
    if (ad5 != undefined) ad5.remove();
    if (ad6 != undefined && ad) {
        ad6.style.display = 'none';
        ad = false;
    }
    if (ad7 != undefined) ad7.remove();
    if (cross != undefined) cross.click();
    if (skip != undefined) skip.click();

    const cargarPeliculas = async () => {
        try {
            let enlace = document.baseURI.split('=')[1].split('&')[0];
            enlace = document.baseURI.split('=')[1].split('&')[0];
            const respuesta = await fetch(`https://returnyoutubedislikeapi.com/Votes?videoId=${enlace}`);
            // Si la respuesta es correcta
            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                // console.log(datos);
                const Formatter = (num, digits) => {
                    const lookup = [{
                            value: 1,
                            symbol: ""},
                        {
                            value: 1e3,
                            symbol: "K"
                        },
                        {
                            value: 1e6,
                            symbol: "M"
                        }
                    ];
                    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                    const item = lookup.slice().reverse().find((item) => {
                        return num >= item.value
                    })
                    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0"
                }
                addDislike.textContent = `${Formatter(datos.dislikes, 0)}`;

            } else if (respuesta.status === 401) {
                // console.log('Error en la pagina');
            } else if (respuesta.status === 404) {
                // console.log('Error');
            } else {
                // console.log('Hubo un error');
            }

        } catch (error) {
            // console.log(error);
        }
    }
    cargarPeliculas();
}, 100);
clearTimeout(5000);
document.head.insertAdjacentHTML("beforeend", `<style>
       .container{
           display: flex;
           justify-content: center;
           align-items: center;
           user-select: none;
         }
         .container form button {
           background: #fff;
           height: 50px;
       }
       .container form button:hover {
           background: #018fc3;
           cursor: pointer;
       }
       </style>`);
})();