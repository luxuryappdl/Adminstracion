/* =========================================================
   DL LUXURY
   SCRIPT PRINCIPAL

   ESTE ARCHIVO MANEJA ÚNICAMENTE:

   - Instalación PWA

   =========================================================

   IMPORTANTE:

   EL DASHBOARD LO MANEJA:

   admin.js

   EL SELECTOR DE AÑOS LO MANEJA:

   anos.js

   ESTE ARCHIVO NO MANEJA:

   - Ventas
   - Ingresos
   - Egresos
   - Stock
   - Dashboard
   - Selector de año
   - Año seleccionado
   - Productos
   - Categorías
   - Pedidos

========================================================= */


/* =========================================================
   DL LUXURY
   BOTÓN DE INSTALACIÓN PWA
========================================================= */

let deferredPrompt = null;


/* =========================================================
   OBTENER BOTÓN
========================================================= */

function obtenerBotonInstalarPWA() {

    return document.getElementById(
        "botonInstalarPWA"
    );
}


/* =========================================================
   PREPARAR BOTÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const botonInstalarPWA =
            obtenerBotonInstalarPWA();


        if (
            botonInstalarPWA
        ) {

            /*
               IMPORTANTE:

               El botón permanece oculto
               hasta que el navegador confirme
               que la PWA puede instalarse.
            */

            botonInstalarPWA.classList.remove(
                "visible"
            );


            console.log(
                "✅ Botón de instalación preparado."
            );


        } else {

            console.warn(
                "⚠️ No se encontró el botón #botonInstalarPWA."
            );
        }
    }
);


/* =========================================================
   EVENTO DE INSTALACIÓN
========================================================= */

window.addEventListener(
    "beforeinstallprompt",
    function (evento) {

        console.log(
            "📲 PWA disponible para instalar."
        );


        /*
           Evitar que Chrome muestre
           automáticamente el aviso.
        */

        evento.preventDefault();


        /*
           Guardar el evento para utilizarlo
           cuando el usuario presione el botón.
        */

        deferredPrompt =
            evento;


        /*
           Ahora sí mostramos el botón.
        */

        const botonInstalarPWA =
            obtenerBotonInstalarPWA();


        if (
            botonInstalarPWA
        ) {

            botonInstalarPWA.classList.add(
                "visible"
            );
        }

    }
);


/* =========================================================
   CLICK EN EL BOTÓN DE INSTALACIÓN
========================================================= */

document.addEventListener(
    "click",
    async function (evento) {

        const boton =
            evento.target.closest(
                "#botonInstalarPWA"
            );


        if (!boton) {
            return;
        }


        /* =================================================
           COMPROBAR SI CHROME PERMITE INSTALAR
        ================================================= */

        if (
            !deferredPrompt
        ) {

            console.log(
                "ℹ️ La instalación todavía no está disponible."
            );


            return;
        }


        try {

            /*
               Mostrar ventana nativa
               de instalación.
            */

            await deferredPrompt.prompt();


            /*
               Esperar respuesta del usuario.
            */

            const resultado =
                await deferredPrompt.userChoice;


            console.log(
                "📲 Resultado de instalación:",
                resultado.outcome
            );


        } catch (error) {

            console.error(
                "❌ Error durante la instalación de la PWA:",
                error
            );


        } finally {

            /*
               El evento solamente puede
               utilizarse una vez.
            */

            deferredPrompt =
                null;


            /*
               Ocultar botón hasta que
               vuelva a estar disponible.
            */

            boton.classList.remove(
                "visible"
            );
        }

    }
);


/* =========================================================
   CUANDO LA APP YA FUE INSTALADA
========================================================= */

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "✅ DL Luxury fue instalada correctamente."
        );


        deferredPrompt =
            null;


        const botonInstalarPWA =
            obtenerBotonInstalarPWA();


        if (
            botonInstalarPWA
        ) {

            botonInstalarPWA.classList.remove(
                "visible"
            );
        }

    }
);
