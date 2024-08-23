---
title: 注册 Service Worker | 指南
---

# 注册 Service Worker

通过使用 `injectRegister` 配置项 (**可选**)，`vite-plugin-pwa`插件将自动为您注册 service worker.

您可这样配置 `injectRegister` 插件选项:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      injectRegister: 'auto',
    }),
  ],
});
```

`injectRegister`选项可以控制在您的应用中如何注册 service worker:

- `inline`: 会注入一个简单的注册脚本，并将其内联到应用程序入口点
- `script`: 它在生成的脚本中向 `head` 标签中插入一个带有 `src` 属性的 `script` 标签，以注册 service worker
- `script-defer` <Badge type="tip" text="自 v0.17.2+" />: 它在生成的脚本中向 `head` 标签中插入一个带有`defer`属性和 `src` 属性的 `script` 标签，以注册 service worker
- `null` (手动): 什么都不会做，您需要自己注册 Service Worker，或者导入插件公开的虚拟模块
- **`auto` (默认值)**: 取决于你是否使用插件公开的任何虚拟模块，它将什么都不做或者切换到 `script` 模式

您可以在[Frameworks](/frameworks/)章节找到有关插件暴露虚拟模块的更多信息。

## 内联注册

When configuring `injectRegister: 'inline'` in the plugin configuration, the plugin will inline a head script adding in to your application entry point:
::: details **内联头部脚本**

```html
<head>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' });
      });
    }
  </script>
</head>
```

:::

## 脚本注册

When configuring `injectRegister: 'script' | 'script-defer'` in the plugin configuration, the plugin will generate a `registerSW.js` script adding it to your application entry point:
::: details **头部脚本**

```html
<head>
  <script src="/registerSW.js"></script>
</head>
```

:::

::: details **/registerSW.js**

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
  });
}
```

:::

## 手动注册

When configuring `injectRegister: null` in the plugin configuration, the plugin will do nothing, you must register the service workbox manually yourself.

Or you can import any of the virtual modules exposed by the plugin.

If you're using `injectManifest` strategy in development with `devOptions` enabled, you should check [injectManifest development section](/guide/development#injectmanifest-strategy) to get details on getting the right ServiceWorker URL for your development setup.

## 自动注册

If your application code base is not importing any of the virtual modules exposed by the plugin, the plugin will fallback to [Script Registration](/guide/register-service-worker#script-registration), otherwise, the imported virtual module will register the service worker for you.
