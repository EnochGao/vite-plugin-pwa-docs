---
title: Advanced (injectManifest) | 指南
outline: deep
---

# Advanced (injectManifest)

使用 service worker `strategy` ，你可以构建自己的 service worker

The `vite-plugin-pwa` plugin will compile your custom service worker and inject its service worker's precache manifest.

By default, the plugin will assume the `service worker` source code is located at the `Vite's public` folder with the name `sw.js`, that's, it will search in the following file: `/public/sw.js`.

If you want to change the location and/or the service worker name, you will need to change the following plugin options:

- `srcDir`: **must** be relative to the project root folder
- `filename`: including the file extension and **must** be relative to the `srcDir` folder

For example, if your service worker is located at `/src/my-sw.js` you must configure it using:

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

We recommend you to use [Workbox](https://developer.chrome.com/docs/workbox/) to build your service worker instead using `importScripts`, you will need to include `workbox-*` dependencies as `dev dependencies` to your project.

### 插件配置

You **must** configure `strategies: 'injectManifest'` in `vite-plugin-pwa` plugin options in your `vite.config.ts` file:

```ts
VitePWA({
  strategies: 'injectManifest',
});
```

### 开发

If you would like the service worker to run in development, make sure to enable it in the [devOptions](/guide/development#plugin-configuration) and to set the type to [module](/guide/development#injectmanifest-strategy) if required.

### Service Worker Code

Your custom service worker (`public/sw.js`) should have at least this code (you also need to install `workbox-precaching` as `dev dependency` to your project):

```js
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
```

If you're not using `precaching` (`self.__WB_MANIFEST`), you need to disable `injection point` to avoid compilation errors (available only from version `^0.14.0`), add the following option to your pwa configuration:

```ts
injectManifest: {
  injectionPoint: undefined;
}
```

### Service worker errors on browser

<ServiceWorkerClientErrors />

### Cleanup Outdated Caches

<CleanupOutdatedCaches />

<InjectManifestCleanupOutdatedCaches />

### Inject Manifest Source Map <Badge type="tip" text="new options from v0.18.0+" />

<InjectManifestSourceMap />

### Custom Rollup and Vite Plugins <Badge type="tip" text="from v0.18.0+" />

From `v0.18.0`, you can add custom Rollup and/or Vite plugins to the service worker build, using `rollup` and `vite` options in the new `buildPlugins` option.

::: warning
The old `plugins` option has been deprecated, use `buildPlugins.rollup` instead:

- if `buildPlugins.rollup` is configured then `plugins` will be ignored
- if `buildPlugins.rollup` is not configured then `plugins` will be used
  :::

You can check the [vue-router example](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/vue-router) using a custom Vite plugin with a simple virtual module consumed by both custom service workers.

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
