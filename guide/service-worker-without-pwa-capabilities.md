---
title: 没有PWA功能的Service Worker | 指南
---

# 没有 PWA 功能的 Service Worker

Sometimes you don't need the full blown PWA functionality like **offline cache** and **manifest file**, but need simple custom Service Worker.

You can disable all `vite-plugin-pwa` supported features, and use it just to manage your Service Worker file.

## Service Worker 代码

Suppose you want to have a Service Worker file that captures browser `fetch`:

```js
// src/service-worker.js or src/service-worker.ts
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
```

You would like to have this service worker reloaded on each change in **development** and prepared for **production**.

## 插件配置

You should configure `vite-plugin-pwa` plugin options in your Vite configuration file with the following options:

```js
// vite.config.js or vite.config.ts
VitePWA({
  srcDir: 'src',
  filename: 'service-worker.js',
  strategies: 'injectManifest',
  injectRegister: false,
  manifest: false,
  injectManifest: {
    injectionPoint: undefined,
  },
});
```

## 开发

If you would like the service worker to run in development, make sure to enable it in the [devOptions](/guide/development#plugin-configuration) and to set the type to [module](/guide/development#injectmanifest-strategy) if required.

## 在你的应用中注册 Service Worker

Use the code below in your entry point module:

```js
// src/main.js or src/main.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production'
      ? '/service-worker.js'
      : '/dev-sw.js?dev-sw'
  );
}
```

If you're using import statements inside your service worker (will work only on chromium based browsers) check [injectManifest](/guide/development.html#injectmanifest-strategy) section for more info:

```js
// src/main.js or src/main.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production'
      ? '/service-worker.js'
      : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  );
}
```
