---
title: 注销 Service Worker | 指南
---

# 注销 Service Worker

如果您想从 PWA 应用程序中注销 Service Worker，你只需要在插件配置中添加 `selfDestroying: true` 即可.

`vite-plugin-pwa`插件将在生产环境中部署后创建一个新的特殊 service worker，并替换应用程序中现有的 service worker：它必须放在之前损坏/不需要的 service worker 的位置上，并且名称相同

::: info 信息

从版本 `0.17.2+` 开始，service worker 将删除其所有缓存存储项
:::

::: danger 危险

重要的是不要更改插件配置中的任何内容，尤其是不要更改 SERVICE WORKER 的名称，只保留选项和 PWA UI 组件(如果包含)，插件将负责更改 SERVICE WORKER 并避免与配置的 UI 交互。
:::

在将来，如果您想再次将 PWA 添加到您的应用程序中，只需删除 `selfDestroying` 选项或仅将其禁用即可： `selfDestroying: false`

## 自定义 `selfDestroying` Service Worker

如果你想卸载当前部署的 service worker 并安装一个新的 service worker，不要使用 `selfDestroying`：

- 在 `public` 文件夹中使用当前部署的 service worker 名称创建一个新的 JavaScript 文件，检查下面的示例
- 在 PWA 配置中更改`filename` (这将生成一个具有新名称的新 service worker)

例如，如果您没有指定 `filename`，service worker 名称将为 `sw.js`（默认值）。将 `filename` PWA 选项更改为 `service-worker.js` 或其他不同于 `sw.js` 的名称，然后将以下代码添加到 `public/sw.js` 文件（当前部署的 service worker）中：

```js
// public/sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient) client.navigate(client.url);
      });
      return Promise.resolve();
    })
    .then(() => {
      self.caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return self.caches.delete(cacheName);
          })
        );
      });
    });
});
```

你可以根据需要重复上述过程多次，**记住不要从公共目录中删除**任何 service worker(你不知道你的应用程序的用户安装了什么版本)

## 开发

您还可以在启用开发选项的开发服务器中检查 `selfDestroying` 插件选项:查看[开发部分](/guide/development) 以获取更多信息。

## 示例

在 examples 文件夹中，您可以在相应的 `package.json`中找到`**-destroy`脚本，您可以在开发服务器上或从生产版本中尝试它。

## Credits

实现基于这个 GitHub 仓库 [Self-destroying ServiceWorker](https://github.com/NekR/self-destroying-sw)，有关更多信息，请阅读 [Medium: Self-destroying ServiceWorker](https://medium.com/@nekrtemplar/self-destroying-serviceworker-73d62921d717)。
