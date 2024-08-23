---
title: PWA最低要求 | 指南
---

# PWA 最低要求

Previous steps in this guide, are the minimal requirements and configuration to create the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and the service worker when you build your application, but you'll need to include more options to meet PWA Minimal Requirements.

Your application **must** meet the PWA Minimal Requirements before deploying it to production or when testing your build on local: for example, when testing your PWA application on local using `LightHouse`.

To make your PWA application installable (one of the requirements), you will need to modify your application entry point, add some minimal entries to your `Web App Manifest`, allow search engines to crawl all your application pages and configure your server properly (only for production, on local you can use `https-localhost` dependency and `node`).

Check also the new [PWA 最低要求](/assets-generator/#pwa-minimal-icons-requirements) page in the [PWA Assets 生成器](/assets-generator/) section.

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

To configure the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), add the `manifest` entry to the `vite-plugin-pwa` plugin options.

Following with the example, here a minimal configuration (you must provide all the icons and images):

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

You can also specify `manifest: false` to disable the `Web App Manifest` generation adding your own `manifest.webmanifest/manifest.json` file to the `public` folder on your application.

The `vite-plugin-pwa` has the full definition of the `Web App Manifest` options, if you want to have DX support when using your own web manifest, add the following entry to your custom web manifest (VSCode and JetBrains IDEs will use it to provide DX support):

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json"
}
```

## Icons / Images

:::tip
Check out the [PWA Assets 生成器](/assets-generator/) to generate all the icons and images required for your PWA application.

You can also use [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator) to generate all your PWA application's icons.
:::

For `manifest` icons entry, you will need to create `pwa-192x192.png`, and `pwa-512x512.png` icons. The icons specified above are the minimum required to meet PWA, that is, icons with `192x192` and `512x512` resolutions.

We suggest creating a svg or png icon (if it is a png icon, with the maximum resolution possible) for your application and use it to generate your PWA icons:

- [PWA Assets 生成器](/assets-generator/) (recommended).
- [Favicon InBrowser.App](https://favicon.inbrowser.app/tools/favicon-generator) (recommended).
- [Favicon Generator](https://realfavicongenerator.net/).

For `mask-icon` in the entry point, use the svg or the png used to generate the favicon package.

Once generated, download the ZIP and use `android-*` icons for `pwa-*`:

- use `android-chrome-192x192.png` for `pwa-192x192.png`
- use `android-chrome-512x512.png` for `pwa-512x512.png`
- `apple-touch-icon.png` is `apple-touch-icon.png`
- `favicon.ico` is `favicon.ico`

If you want you can add the `purpose: 'any maskable'` icon to the Web App Manifest, but it is better to add 2 icons with `any` and `maskable` purposes:

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

You **must** add a `robots.txt` file to allow search engines to crawl all your application pages, just add `robots.txt` to the `public` folder on your application:

```txt
User-agent: *
Allow: /
```

:::warning
`public` folder must be on the root folder of your application, not inside the `src` folder.
:::

## 服务器配置

你可以使用你想要的服务器，但你的服务器**必须**：

- `manifest.webmanifest` 设置 MIME 类型 `application/manifest+json`
- 将您的应用程序部署到 `https`
- 从 `http` 重定向到 `https`

您可以在 [部署](/deployment/)部分找到更多信息
