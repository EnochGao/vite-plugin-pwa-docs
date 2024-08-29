---
title: 没有PWA功能的Service Worker | 指南
---

# 没有 PWA 功能的 Service Worker

有时候你不需要完整的 PWA 功能，比如**离线缓**存和**manifest 文件**，而只需要简单的自定义 Service Worker

你可以禁用所有 `vite-plugin-pwa` 支持的功能，仅使用它来管理你的 Service Worker 文件

## Service Worker 代码

假设你想创建一个 Service Worker 文件，用于捕获浏览器的 `fetch`:

```js
// src/service-worker.js or src/service-worker.ts
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
```

你希望在**开发**过程中每次更改时都能重新加载 service worker，并为**生产**做好准备

## 插件配置

你应该在你的 Vite 配置文件中使用以下选项配置 `vite-plugin-pwa` 插件

```js
// vite.config.js 或者 vite.config.ts
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

如果你想让 service worker 在开发环境中运行，请确保在[devOptions](/guide/development#plugin-configuration)中启用它，如果需要，设置 type 类型为[module](/guide/development#injectmanifest-策略)

## 在你的应用中注册 Service Worker

在您的入口模块中使用以下代码:

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

如果你在服务端脚本中使用了导入语句（仅在基于 Chromium 的浏览器中生效），请检查 [injectManifest](/guide/development.html#injectmanifest-策略) 部分以获取更多信息：

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
