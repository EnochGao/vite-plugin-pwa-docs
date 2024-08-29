---
title: 高级 (injectManifest) | 指南
outline: deep
---

# 高级 (injectManifest)

使用 service worker `strategy` ，你可以构建自己的 service worker

`vite-plugin-pwa` 插件将编译你的自定义 service worker 并注入 service worker 的预缓存清单

默认情况下，插件将假定 `service worker` 源代码位于 `Vite的public` 文件夹，名为 `sw.js` ，也就是说，它将在以下文件中搜索: `/public/sw.js` 。

如果要更改位置或 service worker 名称，则需要更改以下插件选项:

- `srcDir`: **必须**是相对于项目根目录的
- `filename`: 包括文件扩展名，**必须**相对于 **srcDir** 文件夹

例如，如果你的 service worker 位于 `/src/my-sw.js` ，你必须使用以下方式配置它:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'my-sw.js',
    }),
  ],
});
```

## 自定义 Service worker

我们建议您使用 [Workbox](https://developer.chrome.com/docs/workbox/) 来构建您的 service worker，而不是使用 `importScripts` ，您需要包含 `workbox-\*` 依赖项作为 `dev dependencies` 到您的项目中。

### 插件配置

在您的 `vite.config.ts` ,vite-plugin-pwa 插件选项中，您**必须**配置 `strategies: 'injectManifest'`

```ts
VitePWA({
  strategies: 'injectManifest',
});
```

### 开发

如果您希望 service worker 在开发环境中运行，请确保在 [devOptions](/guide/development#插件配置) 中启用它，并在需要时将 type 设置为 [module](/guide/development#injectmanifest-策略)

### Service Worker 代码

自定义 service worker ( `public/sw.js` )至少应该有以下代码(你还需要将 `workbox-precaching` 作为 `dev dependency` 安装到你的项目中):

```js
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
```

如果你没有使用 `precaching` ( `self.__WB_MANIFEST` )，你需要禁用 `injection point` 以避免编译错误(仅从版本 `^0.14.0` 开始)，将以下选项添加到你的 pwa 配置中:

```ts
injectManifest: {
  injectionPoint: undefined;
}
```

### Service worker 浏览器中的错误

<ServiceWorkerClientErrors />

### 清理过期缓存

<CleanupOutdatedCaches />

<InjectManifestCleanupOutdatedCaches />

### Inject Manifest Source Map <Badge type="tip" text="新选项自 v0.18.0+" />

<InjectManifestSourceMap />

### 自定义 Rollup 和 Vite 插件<Badge type="tip" text="从 v0.18.0+" />

从 `v0.18.0` ，您可以在新的 `buildPlugins` 选项中使用 `rollup` 和 `vite` 添加自定义 Rollup 和 Vite 插件来构建 service worker。

::: warning 警告

旧的 `plugins` 已被弃用，使用 `buildPlugins.rollup` 代替:

- 如果配置了 `buildPlugins.rollup` ，则忽略 `plugins`
- 如果没有配置 `buildPlugins.rollup` ，则使用 `plugins`
  :::

你可以查看[vue-router example](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/vue-router)使用一个自定义 Vite 插件，该插件使用简单的虚拟模块都是由 service workers 消费。

## 自动更新行为

如果您需要自定义 service worker 与 `Auto Update` 行为一起工作，则需要更改插件配置选项并向 service worker 代码中添加一些自定义代码

### 插件配置

您必须在您的 `vite.config.ts` 文件中为`vite-plugin-pwa` 插件选项配置`registerType: 'autoUpdate'` :

```ts
VitePWA({
  registerType: 'autoUpdate',
});
```

### Service Worker 代码

您**必须**在您的 service worker 代码中至少包含以下代码(您还需要将`workbox-core` 安装为 `dev dependency` 到您的项目中)

```js
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();
```

## 更新提示行为

如果你需要自定义 service worker 与 `Prompt For Update` 行为一起工作，你需要更改你的 service worker 代码

### Service Worker 代码

你至少需要在 service worker 中包含以下代码:

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
```

## TypeScript 支持

你可以使用 TypeScript 编写自定义 service worker。要解析 service worker 类型，只需在 `tsconfig.json` 文件中添加 `WebWorker` 到 `lib` 条目中:

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "WebWorker"]
  }
}
```

### 插件配置

我们建议您将自定义 service worker 放在 `src` 目录中。

你需要在你的 `vite.config.ts` 文件中配置 `srcDir: 'src'` 和 `filename: 'sw.ts'` 插件选项，正确配置这两个选项的目录和自定义 service worker 的名称·

```ts
VitePWA({
  srcDir: 'src',
  filename: 'sw.ts',
});
```

### Service Worker Code

你需要用 `ServiceWorkerGlobalScope` 定义 `self` 作用域:

```ts
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
```
