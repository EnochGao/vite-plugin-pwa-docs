---
title: 自动重新加载 | 指南
outline: deep
---

# 自动重新加载

有了这种行为，一旦浏览器检测到您的应用程序的新版本，那么，它将更新缓存，并将重新加载所有浏览器窗口/选项卡，并自动打开应用程序以获得控制权

::: warning 警告

为了重新加载所有客户端选项卡/窗口，你需要导入插件提供的虚拟模块:如果你没有使用任何虚拟，就没有办法与应用程序 ui 交互，因此，任何客户端选项卡/窗口都不会重新加载(旧的 service worker 仍将控制应用程序)。

自动重载不是自动页面重载，如果你想**自动页面重载**，你需要在应用程序入口点中使用以下代码：

```js
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });
```

:::

使用这种行为的缺点是，用户可能会在一些浏览器窗口/选项卡中丢失数据，那些应用程序是打开的，和那些正在填写表单的。

如果您的应用程序有表单，我们建议您更改行为，使用默认 `prompt` 选项，以允许用户决定何时更新应用程序的内容

::: danger 危险

在您将应用程序投入生产之前，您需要确定您希望 service worker 的行为。将 service worker 的行为从 `autoUpdate` 更改为 `prompt` 可能会很痛苦。

:::

## 插件配置

使用此选项，插件将强制 `workbox.clientsClaim` 和 `workbox.skipWaiting` 在插件选项上为 `true。`

您必须在您的 `vite.config.ts` 文件中添加 `registerType: 'autoUpdate'` 到 `vite-plugin-pwa`插件选项:

```ts
VitePWA({
  registerType: 'autoUpdate',
});
```

### 清除过期缓存

<CleanupOutdatedCaches />

<GenerateSWCleanupOutdatedCaches />

### Inject Manifest Source Map <Badge type="tip" text="自v0.18.0+新选项" />

<InjectManifestSourceMap />

### 生成 SW 源码映射

<GenerateSWSourceMap />

## 导入虚拟模块

使用此行为时，如果您需要在应用程序准备离线工作时向用户提示对话框，则**必须**导入 `vite-plugin-pwa` 插件暴露的其中一个虚拟模块。否则，您可以导入或忽略它。

如果你没有导入任何一个虚拟模块，自动重新加载仍然会工作

### 准备离线工作

您必须在 `main.ts` 或 `main.js` 文件中包含以下代码

```ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onOfflineReady() {},
});
```

您需要在`onOfflineReady`回调中使用`OK`按钮向用户显示一个准备好脱机工作的对话框。

当用户点击 `OK` 按钮时，只需隐藏提示展示在 `onOfflineReady` 方法中。

### SSR/SSG

<SsrSsg />
