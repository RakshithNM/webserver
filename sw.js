"use strict";

const version = 5;
var cacheName = `express-sample-${version}`;

var urlsToCache = [
  '/',
  '/about',
  '/projects',
];

//Service worker events
self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);

main().catch(console.error);

async function main() {
  console.log(`Service worker (${version}) is starting...`);
  await cacheFiles();
}

//Install event handler
async function onInstall() {
  console.log(`Service worker (${version}) installed`);
  //Once installed enter the  active state, no waiting for the previous service worker to shut down
  self.skipWaiting();
}

function onFetch(evt) {
  evt.respondWith(router(evt.request));
}

async function router(req) {
  var url = new URL(req.url);
  var reqURL = url.pathname;
  var cache = await caches.open(cacheName);

  if(url.origin == location.origin) {
    let res;
    try {
      let fetchOptions = {
        method: req.method,
        headers: req.headers,
        cache: 'no-store'
      }
      let res = await fetch(req.url, fetchOptions);
      if(res && res.ok) {
        await cache.put(reqURL, res.clone());
        return res;
      }
    }
    catch(err) {}
    res = await cache.match(reqURL);
    if(res) {
      return res.clone();
    }
  }
}

async function onActivate(evt) {
  //Tell the browser not to shutdown until the handleActivation function is done its work
  evt.waitUntil(handleActivation());
}

async function handleActivation() {
  await clearCaches();
  /* Handle the case of when the service worker changes and there are more tabs controlled by the service worker and tell the open clients to be claimed by the new service worker */
  await clients.claim();
  await cacheFiles(/*forceReload*/true);
  console.log(`Service Worker (${version}) activated.`);
}

async function cacheFiles(forceReload = false) {
  var cache = await caches.open(cacheName);

  return Promise.all(urlsToCache.map(async function cacheFile(url) {
    let res; 
    try {
      if(!forceReload) {
        res = await cache.match(url);
        if(res) {
          return res;
        }
      }
      let fetchOptions = {
        method: "GET",
        cache: 'no-cache',
      }
      res = await fetch(url, fetchOptions);
      if(res.ok) {
        await cache.put(url, res);
      }
    }
    catch(err) {
    }
  }))
}

async function clearCaches() {
  var cacheNames = await caches.keys();
  var oldCacheNames = cacheNames.filter(function matchOldCache(cacheName) {
    if(/^express-sample-\d+$/.test(cacheName)) {
      let [, cacheVersion] = cacheName.match(/^express-sample-(\d+)$/);
      cacheVersion = (cacheVersion != null) ? Number(cacheVersion) : cacheVersion;
      return (cacheVersion > 0 && cacheVersion != version); 
    }
  });
  return Promise.all(oldCacheNames.map(function deleteCache(cacheName) {
    return caches.delete(cacheName);
  }));
}
