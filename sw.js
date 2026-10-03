/* =========================================================
   DL LUXURY
   PWA - ADMINISTRACIÓN
========================================================= */

const CACHE_NAME = "dl-luxury-admin-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./admin.js",
    "./adonvent.js",
    "./pedidos-admin.js",
    "./manifest.json",
    "./luxurylogo.png"
];


/* =========================================================
   INSTALAR
========================================================= */

self.addEventListener("install", event => {

    console.log("DL Luxury SW: instalando...");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(ARCHIVOS);

            })

            .then(() => {

                console.log(
                    "DL Luxury SW: archivos almacenados."
                );

                return self.skipWaiting();

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
                                "Eliminando caché antigua:",
                                key
                            );

                            return caches.delete(key);

                        }

                        return null;

                    })

                );

            })

            .then(() => {

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
       NAVEGACIÓN HTML
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

                    });

            })

    );

});