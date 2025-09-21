const CACHE_NAME='TechCal-v1';
const urlToCache=[
    '/',
    '/index.html',
    '/index.css',
    '/script,js',
    '/manifest.json',
    '/icon-192x192.png',
];

//install event
self.addEventListener('install',event =>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache=>{
            return cache.addAll(urlToCache);
            
        })
    );
});

//fetch event
self.addEventListener('fetch',event=>{
    event.respondWith(
        caches.match(event.request)
        .then(response=>{
            //return cached version ot fetch from network
            return response || fetch(event.request);
        })
    );
});

//activate event
self.addEventListener('activate',event=>{
    event.waitUntil(
        caches.keys().then(cacheNames=>{
            return Promise.all(
                cacheNames.map(cache=>{
                    if(cache!==CACHE_NAME){
                        return caches.delete(cache);
                    }
                })
            
            );
        })
    );
});