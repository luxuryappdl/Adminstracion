/* =========================================================
   DL LUXURY
   PWA - ADMINISTRACIÓN
========================================================= */

const CACHE_NAME = "dl-luxury-admin-v3";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./admin.js",
    "./adonvent.js",
    "./pedidos-admin.js",
    "./anos.js",
    "./manifest.json",

    /* ICONOS PWA */
    "./luxurylogo-192.png",
    "./luxurylogo-512.png",

    /* CAPTURAS PWA */
    "./screenshot-mobile.png",
    "./screenshot-desktop.png"
];


/* =========================================================
   INSTALAR
========================================================= */

self.addEventListener("install", event => {

    console.log("DL Luxury SW: instalando versión:", CACHE_NAME);

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                console.log(
                    "DL Luxury SW: guardando archivos..."
                );

                return cache.addAll(ARCHIVOS);

            })

            .then(() => {

                console.log(
                    "DL Luxury SW: archivos almacenados correctamente."
                );

                return self.skipWaiting();

            })

            .catch(error => {

                console.error(
                    "DL Luxury SW: error al guardar archivos:",
                    error
                );

                throw error;

            })

    );

});


/* =========================================================
   ACTIVAR
========================================================= */

self.addEventListener("activate", event => {

    console.log(
        "DL Luxury SW: activando versión:",
        CACHE_NAME
    );

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            console.log(
                                "DL Luxury SW: eliminando caché antigua:",
                                key
                            );

                            return caches.delete(key);

                        }

                        return null;

                    })

                );

            })

            .then(() => {

                console.log(
                    "DL Luxury SW: caché actualizada."
                );

                return self.clients.claim();

            })

    );

});


/* =========================================================
   PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

    /* -----------------------------------------------
       Solo GET
    ------------------------------------------------ */

    if (event.request.method !== "GET") {
        return;
    }


    const url = new URL(event.request.url);


    /* =====================================================
       NO CACHEAR SUPABASE
    ===================================================== */

    if (
        url.hostname.includes("supabase.co")
    ) {

        return;

    }


    /* =====================================================
       NO CACHEAR CDN
    ===================================================== */

    if (
        url.hostname.includes("cdnjs.cloudflare.com") ||
        url.hostname.includes("jsdelivr.net") ||
        url.hostname.includes("fonts.googleapis.com") ||
        url.hostname.includes("fonts.gstatic.com")
    ) {

        return;

    }


    /* =====================================================
       NAVEGACIÓN / HTML
       
       SIEMPRE INTENTAR RED PRIMERO
    ===================================================== */

    if (
        event.request.mode === "navigate" ||
        url.pathname.endsWith(".html") ||
        url.pathname === "/"
    ) {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    /*
                     * Si la respuesta es válida,
                     * devolver directamente la versión nueva.
                     */

                    return response;

                })

                .catch(() => {

                    /*
                     * Si no hay internet,
                     * utilizar la versión almacenada.
                     */

                    return caches.match(event.request);

                })

        );

        return;

    }


    /* =====================================================
       ARCHIVOS LOCALES
       
       CACHE FIRST
    ===================================================== */

    event.respondWith(

        caches.match(event.request)

            .then(cached => {

                if (cached) {

                    return cached;

                }


                return fetch(event.request)

                    .then(response => {

                        /*
                         * No guardar respuestas inválidas.
                         */

                        if (
                            !response ||
                            response.status !== 200 ||
                            response.type === "opaque"
                        ) {

                            return response;

                        }


                        /*
                         * Guardar una copia de los archivos
                         * locales que se soliciten.
                         */

                        const copia = response.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(
                                    event.request,
                                    copia
                                );

                            });


                        return response;

                    });

            })

    );

});
