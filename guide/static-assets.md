---
title: 静态资产处理 | 指南
---

# 静态资产处理

默认情况下，`PWA Web App Manifest` 选项中的所有图标，都可以在 Vite 的 `publicDir` 选项目录中找到，他们都会被包含在 service worker 预缓存中。您可以使用 `includeManifestIcons: false` 选项来禁用。

你还可以使用 `includeAssets` 选项添加其他静态资产，如 `favicon` 、 `svg` 和 `font` 文件。 `includeAssets` 选项将通过 Vite 的 `publicDir` 选项目录中的 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) 进行解析，因此你可以使用正则表达式来包含这些资产，例如： `includeAssets: ['fonts/*.ttf', 'images/*.png']` 。你不需要在 `includeAssets` 选项中配置 `PWA Manifest icons`

## 重用 src/assets images

::: warning 警告

该功能尚未可用
:::

如果你在应用程序中通过 `src/assets` 目录（或其他任何目录）使用图像，并且你想在 `PWA Manifest` 图标中重用这些图像，可以使用它们，但有以下三个限制：

- 位于 `src/assets` 目录（或任何其他目录）下的任何图像都必须通过静态导入或直接在 `src` 属性上使用，才能在您的应用程序中使用
- 你必须使用相对于根文件夹的资产目录路径来引用 `PWA Manifest` 图标中的图片： `./src/assets/logo.png` 或 `src/assets/logo.png`
- 如果无法使用内联图标，则需要将这些图像复制或移动到 Vite 的 `publicDir` 选项目录中：请参阅[将资源引入为 URL](https://cn.vitejs.dev/guide/assets#importing-asset-as-url)和 [Vite 的 assetsInlineLimit 项](https://cn.vitejs.dev/config/build-options#build-assetsinlinelimit)。

::: warning 警告

如果你从任何资源文件夹中使用了 PWA Manifest 图标，但没有在应用程序中使用这些图像（通过静态导入或 src 属性），Vite 将不会生成这些资产，因此在构建输出中将缺失：

```shell
Error while trying to use the following icon from the Manifest: https://localhost/src/assets/pwa-192x192.png (Download error or resource isn't a valid image)
```

如果出现这种情况，您需要将这些图像复制或移动到 Vite 的 `publicDir` 选项目录（默认为 `public`）中，并正确配置图标
:::

例如，如果您有以下图像`src/assets/logo-192x192.png` ，您可以在您的 `PWA Manifest` 图标中添加它：

```json
{
  "src": "./src/assets/logo-192x192.png",
  "sizes": "192x192",
  "type": "image/png"
}
```

然后，在您的代码库中，必须通过静态导入使用它：

```js
// src/main.js or src/main.ts
// 可以是任何 js/ts/jsx/tsx 模块或者单文件组件
import logo from './assets/logo-192x192.png';

document.getElementById('logo-img').src = logo;
```

或者使用 `src` 属性：

```js
// src/main.js or src/main.ts
// 可以是任何 js/ts/jsx/tsx 模块或者单文件组件
document.getElementById('#app').innerHTML = `
  <img src="./assets/logo-192x192.png" alt="Logo" width="192" height="192" />
`;
```

## globPatterns

如果你需要包含不在 Vite 的 `publicDir` 选项目录中的其他资产，你可以使用[workbox](https://developer.chrome.com/docs/workbox/modules/workbox-build#generatesw)或[injectManifest](https://developer.chrome.com/docs/workbox/modules/workbox-build#injectmanifest) 插件选项中的 `globPatterns` 参数。

::: warning 警告

如果你配置 `globPatterns`在 `workbox` 或 `injectManifest` 插件选项，你**必须**包含你所有的资产模式: `globPatterns` 将被 `workbox-build` 用于匹配 `dist` 文件夹中的文件。

默认情况下， `globPatterns` 将被设置为 `**/*.{js,css,html}` ： `workbox` 将使用[glob primer](https://github.com/isaacs/node-glob#glob-primer)来匹配文件，使用 `globPatterns` 作为过滤器。

一个常见的陷阱是只包含某些资产，却忘记添加 `css` 、 `js` 和 `html` 资产模式，然后您的服务工作器会抱怨缺少资源

例如，如果您没有包含 `html` 资产模式，您的 service worker 将出现以下错误:**WorkboxError non-precached-url index.html**.
:::

要配置 `globPatterns` ，您需要使用 `workbox` 或 `injectManifest` 插件选项，分别用于 `generateSW` 和 `injectManifest` 策略:

::: code-group

```ts [generateSW]
VitePWA({
  workbox: {
    globPatterns: ['**/*.{js,css,html}'],
  },
});
```

```ts [injectManifest]
VitePWA({
  injectManifest: {
    globPatterns: ['**/*.{js,css,html}'],
  },
});
```

:::
