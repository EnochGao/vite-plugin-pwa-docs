---
title: Service Worker 简介 | 指南
---

# Service Worker 简介

正如我们在[Service Worker](/guide/#service-worker)一节中提到的，Service Worker 充当代理，拦截浏览器和服务器之间的请求

因为我们要将 PWA 添加到您的应用程序中，所以我们需要配置 service worker，以便您的应用程序可以离线工作。为此，我们需要配置 Service Worker 的 预缓存清单，它将包含应用程序的所有资源（基本上，我们需要告诉 Service Worker 将哪些资源存储在缓存存储中，以便它可以用于`网络请求拦截`和应用程序离线）。

::: tip 网络请求拦截
您还可以配置如何控制任何应用程序资源的网络请求拦截

你可以在[Workbox - Caching Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies)上找到更多信息。
:::

一旦应用程序注册了 service worker，浏览器将下载 service worker 预缓存清单中的所有资源来安装它。一旦所有资源被浏览器下载并存储在缓存存储中，它将尝试激活 service worker 来控制应用程序

::: tip 提示

只有当 service worker 没有被安装(用户第一次访问你的应用)，或者你的应用有了新版本(如果你改变了应用中的一些资源，service worker 也会在你构建应用后改变，因为它的预缓存清单已经被修改，包含了你的改变)，浏览器才会**下载 service worker 的预缓存清单中的所有资源**。

在任何情况下，浏览器将**始终在后台线程中下载所有资源**，而不是在主浏览器线程中，这样人们就可以在浏览器尝试安装 service worker 时使用应用程序

您可以在隐私窗口中查看此网站或 [VueUse 文档网站](https://vueuse.org/) ，在访问网站之前，只需在开发工具上打开 `Network Tab` :当您浏览网站时，浏览器将开始下载所有资源。
:::

## Precache Manifest

由于 `vite-plugin-pwa` 插件使用[workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build/) node 库来构建 service worker，在 manifest 预缓存中它只包含`css` 、`js`和 `html` 资源(查看 `GlobPartial` 中的 [GlobPartial](https://developer.chrome.com/docs/workbox/modules/workbox-build#type-GlobPartial)条目)。

`workbox-build` node 库是基于文件的，也就是说，它将遍历您应用程序的构建输出文件夹。 `Vite` 将在 `dist` 文件夹中生成你的构建，因此， `workbox-build` 将遍历 `dist` 文件夹，将其中找到的所有资源添加到 service worker 的预缓存清单中

如果需要包含其他资源类型，则需要将它们添加到 `globPatterns` 项中。根据 `vite-plugin-pwa` 插件配置中配置的 `strategy` ，您需要将其添加到 `workbox` 或 `injectManifest` 配置选项中

您可以在[静态资产处理](/guide/static-assets)部分中找到更多信息

例如，如果您需要在[配置 vite-plugin-pwa 指南](/guide/#配置-vite-plugin-pwa)部分的示例中添加 `ico` 、 `png` 和 `svg` 资源，则需要在 `workbox` 条目下添加 `globPatterns` ，因为我们使用的是默认的 `vite-plugin-pwa` 策略( `generateSW` )

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
});
```
