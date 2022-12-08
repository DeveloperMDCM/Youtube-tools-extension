
const cargando = document.querySelector('#cargando');
const container  = document.querySelector("body > div.container");
if (container != undefined){container.style.display = 'none';}
setTimeout(() => {
    if (cargando != undefined){cargando.remove();
        container.style.display = 'block';
    }
}, 1000); 
clearTimeout(1000);