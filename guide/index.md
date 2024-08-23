---
title: 开始 | 指南
---

# 开始

渐进式 Web 应用 （PWAs） 是使用现代 API 构建和增强的 Web 应用程序，具备增强性能、可靠性和可安装性，同时任何人、任何地方、任何设备上都可访问 &mdash; 所有这些都使用单一代码库。

总的来说，PWA 由一个 [Web 应用程序清单](https://developer.mozilla.org/en-US/docs/Web/Manifest)和一个 Service Worker 组成，前者用于向浏览器提供有关您的应用程序的信息，后者用于管理离线体验。

如果你是 PWA 新手，那么在开始之前，你可以考虑先阅读谷歌的[学习 PWA](https://web.dev/learn/pwa/)课程。

## Service Worker

service worker本质上是充当代理服务器的角色，位于Web应用程序、浏览器和网络（如果有可用）之间。service worker旨在实现以下功能：创建有效的离线体验、拦截网络请求并根据网络是否可用采取适当的行动、更新服务器上的资产，以及允许访问推送通知和后台同步API。

Service Worker 是针对域名和路径注册的事件驱动型 [worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)。它采用 JavaScript 文件的形式，可以控制与其关联的网页/站点，拦截和修改导航和资产请求，并以非常精细的方式缓存资产，以便您完全控制应用程序在某些情况下的行为方式（最明显的是当网络不可用时）。

关于 service worker 的更多信息可访问 [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

## Vite PWA

Vite PWA 可以帮助您将现有的应用程序转换为 PWA，而无需进行太多的配置。它预设了适用于常见场景的合理默认值

`vite-plugin-pwa` 插件能够:

- 生成 [web application manifest][webmanifest] 并且添加到程序入口 (查看 [设置生成 manifest 指南](pwa-minimal-requirements#web-app-manifest)).
- 生成 service worker 使用 `strategies` 选项 (更多信息, 查看 ["Service Worker 策略"](/guide/service-worker-strategies-and-behaviors#service-worker-strategies) 部分)
- 生成脚本在浏览器中注册 service worker (查看["注册 Service Worker"](/guide/register-service-worker) 部分)

## 搭建第一个 Vite PWA 项目 <Badge type="tip" text="新"/>

<ScaffoldingPWAProject />

## 安装 vite-plugin-pwa

要安装 `vite-plugin-pwa` 插件，只需将其添加到您的项目中作为 `dev dependency`:

::: code-group

```bash [pnpm]
pnpm add -D vite-plugin-pwa
```

```bash [yarn]
yarn add -D vite-plugin-pwa
```

```bash [npm]
npm install -D vite-plugin-pwa
```

:::

## 配置 vite-plugin-pwa

编辑 `vite.config.js / vite.config.ts` 文件，并且添加 `vite-plugin-pwa`:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [VitePWA({ registerType: 'autoUpdate' })],
});
```

通过`vite-plugin-pwa`插件的最小配置，您的应用程序现在可以生成[Web App Manifest][webmanifest]并将其注入到入口点，生成 service worker 并在浏览器中注册。

你可以在以下[client.d.ts](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts) 文件中找到 `vite-plugin-pwa` 插件的所有配置选项。

::: warning 警告

如果你`vite-plugin-pwa`**没有**使用`0.12.2+`版本 ，则存在一个涉及到 `injectRegister`的 bug（生成的 service worker 将不会包含与 `autoUpdate` 行为一致的代码）。

如果你使用`vite-plugin-pwa`插件版本低于 `0.12.2` ，可以使用以下插件配置来修复此问题：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
```

:::

如果你想在`dev`环境中检查它，请在插件配置中添加`devOptions`选项（您将拥有[Web App Manifest][webmanifest]和生成 service worker）：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
```

如果你要构建你的应用, [Web App Manifest][webmanifest] 将会生成并且配置在应用入口处, service worker 同样会生成并且在 script/module 注注册它并添加到浏览器。

::: info 信息

`vite-plugin-pwa`插件使用 [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build) node 库来构建 service worker，有关更多信息，请参阅[Service Worker 策略 和行为](/guide/service-worker-strategies-and-behaviors) 和[Workbox](/workbox/) 部分。

:::

[webmanifest]: https://developer.mozilla.org/en-US/docs/Web/Manifest
