/* =========================================================
   DL LUXURY
   PWA - ADMINISTRACIÓN
========================================================= */

const CACHE_NAME = "dl-luxury-admin-v4";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./admin.js",
    "./adonvent.js",
    "./pedidos-admin.js",
    "./anos.js",
    "./manifest.json"
];


/* =========================================================
   INSTALAR
========================================================= */

self.addEventListener("install", event => {

    console.log("DL Luxury SW: instalando...");

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
                    "DL Luxury SW: error al instalar:",
                    error
                );

            })

    );

});


/* =========================================================
   ACTIVAR
========================================================= */

self.addEventListener("activate", event => {

    console.log("DL Luxury SW: activando...");

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
                    "DL Luxury SW: caché actualizada correctamente."
                );

                return self.clients.claim();

            })

    );

});


/* =========================================================
   PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }


    const url = new URL(event.request.url);


    /* =====================================================
       NO CACHEAR SUPABASE
    ===================================================== */

    if (url.hostname.includes("supabase.co")) {
        return;
    }


    /* =====================================================
       NO CACHEAR CDN
    ===================================================== */

    if (
        url.hostname.includes("cdnjs.cloudflare.com") ||
        url.hostname.includes("jsdelivr.net")
    ) {
        return;
    }


    /* =====================================================
       NAVEGACIÓN / HTML
       RED PRIMERO
    ===================================================== */

    if (
        event.request.mode === "navigate" ||
        url.pathname.endsWith(".html") ||
        url.pathname === "/"
    ) {

        event.respondWith(

            fetch(event.request)

                .then(response => {

                    return response;

                })

                .catch(() => {

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

                        return response;

                    })

                    .catch(() => {

                        return new Response(
                            "",
                            {
                                status: 503,
                                statusText: "Archivo no disponible"
                            }
                        );

                    });

            })

    );

});
