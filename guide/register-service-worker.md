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

您可以在[框架](/frameworks/)章节找到有关插件暴露虚拟模块的更多信息。

## 内联注册

当在插件配置选项中配置 `injectRegister: 'inline'`, 插件将会在 head 中内联脚本并添加到应用入口处:
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

当在插件配置选项中配置 `injectRegister: 'script' | 'script-defer'` , 插件将会生成一个 `registerSW.js` 脚本添加到你的应用程序入口处:
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

当在插件配置选项中配置 `injectRegister: null`, 插件将什么也不会做, 你必须自己手动注册一个 service workbox。

或者你可以导入插件公开的任何虚拟模块。

如果你在开发环境中使用 `injectManifest` 策略，并且`devOptions`是启用的，你应该查看 [injectManifest 开发章节](/guide/development#injectmanifest-strategy) 以获取开发设置正确的 ServiceWorker URL 详细信息。

## 自动注册

如果你的应用代码库没有导入任何由插件公开的虚拟模块，那么插件将回退到[脚本注册](/guide/register-service-worker#script-registration)，否则，导入的虚拟模块将为你注册 service worker。
