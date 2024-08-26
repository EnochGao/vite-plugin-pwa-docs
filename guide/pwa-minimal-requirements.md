---
title: PWA最低要求 | 指南
---

# PWA 最低要求

本指南中的前面步骤是在构建应用程序时创建 [Web App Manifest](https://developer.mozilla.org/zh_CN/docs/Web/Manifest)和 service worker 的最低要求和配置，然而您需要包含更多选项以满足 PWA 最低要求。

在将应用程序部署到生产环境之前或在本地测试构建时，您的应用程序**必须**满足 PWA 最低要求:例如，在本地使用 `LightHouse` 测试您的 PWA 应用程序时

要使您的 PWA 应用程序可安装(其中一个要求)，您将需要修改应用程序入口点，向 `Web App Manifest` 添加一些最小条目，允许搜索引擎爬取您应用程序的所有页面并正确配置您的服务器(仅用于生产，在本地您可以使用 `https-localhost` 依赖项和 `node` )

还可以查看[PWA 资产生成器](/assets-generator/)中 [PWA 最低要求](/assets-generator/#pwa-minimal-icons-requirements) 部分

## 入口点

您的应用程序入口点(通常是`index.html`)**必须**在 `<head>` 部分中具有以下条目:

- 移动视口配置
- 一个标题
- 一段描述
- 一个图标, 查看以下界面: https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7 还有一个老的 https://www.leereamsnyder.com/blog/favicons-in-2021
- 一个 `apple-touch-icon`链接
- 一个`mask-icon`链接 (现在不需要提供 `mask-icon`)
- 一个 `theme-color`元数据项

例如，一个最小的配置(你必须提供所有的 icons 和 images):

```html
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>My Awesome App</title>
  <meta name="description" content="My Awesome App description" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
  <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF" />
  <meta name="theme-color" content="#ffffff" />
</head>
```

## Web App Manifest

您的应用[Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)**必须**包含以下条目:

- 一个范围: 为了简单起见, `vite-plugin-pwa` 会使用 `Vite` base 配置选项来配置 (默认是 `/`)
- 一个名字
- 一段简单描述
- 一段描述
- 一个`theme_color`: **必须匹配** `Entry Point theme-color`
- 一个大小 `192x192` 图标
- 一个大小 `512x512` 图标

要配置 [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)，请将 `manifest` 条目添加到 `vite-plugin-pwa` 插件选项中

下面是一个简单的配置示例（您必须提供所有 icons 和 images）:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

你也可以通过指定 `manifest: false` 来禁用 `Web App Manifest` 的生成，并将自己的 `manifest.webmanifest/manifest.json` 文件添加到你应用程序的 `public` 文件夹中。

`vite-plugin-pwa` 具有 `Web App Manifest`选项的完整定义，如果您希望在使用自己的`Web App Manifest`时获得 DX 支持，请将以下条目添加到您的自定义 `Web App Manifest`中（VSCode 和 JetBrains IDE 将使用它来提供 DX 支持）：

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json"
}
```

## Icons / Images

:::tip 提示
查看 [PWA 资产生成器](/assets-generator/)以生成 PWA 应用程序所需的所有 icons 和 images。

您还可以使用 [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator) 生成所有 PWA 应用程序的图标。
:::

对于`manifest`中 icons 条目，您需要创建 `pwa-192x192.png` 图标和 `pwa-512x512.png` 图标。上面指定的图标是满足 PWA 的最低要求，即分辨率为 `192x192` 和 `512x512` 的图标。

我们建议为您的应用程序创建一个 svg 或 png 图标（如果它是 png 图标，则具有可能的最大分辨率），并使用它们来生成 PWA 图标：

- [PWA 资产生成器](/assets-generator/) (建议).
- [Favicon InBrowser.App](https://favicon.inbrowser.app/tools/favicon-generator) (建议).
- [Favicon Generator](https://realfavicongenerator.net/).

对于入口点中的`mask-icon`，请使用用于生成 favicon 包的 svg 或 png。

生成后，下载 ZIP 并使用 `android-*` 图标替换 `pwa-*` 图标:

- `android-chrome-192x192.png` 用于 `pwa-192x192.png`
- `android-chrome-512x512.png` 用于 `pwa-512x512.png`
- `apple-touch-icon.png` 用于 `apple-touch-icon.png`
- `favicon.ico` 用于 `favicon.ico`

如果需要，可以将用`purpose: 'any maskable'`添加到应用程序清单中，但最好添加 2 个具有`any`和`maskable`的图标：

```ts
icons: [
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
];
```

## 搜索引擎

你**必须**添加一个名为`robots.txt`的文件，以便搜索引擎能够爬取你的应用程序的所有页面。只需将`robots.txt`文件添加到你的应用程序的 `public` 文件夹中即可:

```txt
User-agent: *
Allow: /
```

:::warning 警告
`public` 文件夹必须位于应用程序的根目录，而不是位于 `src` 文件夹中
:::

## 服务器配置

你可以使用你想要的服务器，但你的服务器**必须**：

- `manifest.webmanifest` 设置 MIME 类型 `application/manifest+json`
- 将您的应用程序部署到 `https`
- 从 `http` 重定向到 `https`

您可以在 [部署](/deployment/)部分找到更多信息
