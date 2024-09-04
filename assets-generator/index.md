---
title: 开始 | PWA Assets 生成器
prev: 常见问题解答 | 指南
outline: deep
---

# 开始

通过使用[sharp](https://github.com/lovell/sharp/) 和 [sharp-ico](https://github.com/ssnangua/sharp-ico)包，[@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator)将会为您的 PWA 应用程序生成所有必需的图标。

该软件包是在[Elk PWA Icon Generator Script](https://github.com/elk-zone/elk/blob/main/scripts/generate-pwa-icons.ts)的基础上开发的

使用一个源图像，您可以通过 `@vite-pwa/assets-generator` [CLI](/assets-generator/cli) 或 [API](/assets-generator/api) 为 PWA 应用生成所需的所有图标

## 源图像

我们强烈建议使用 SVG 图像作为源图像，因为它们可以在不损失质量的情况下缩放到所需的大小，并且应该可以与任何图像类型一起使用。

SVG 源文件还可以用于在 HTML 头部链接中设置网站的图标

## PWA 最小图标要求

正如 [PWA 最低要求](/guide/pwa-minimal-requirements) 指出, 你需要:

- 一个 192x192 像素的图标（PWA Manifest 图标）
- 一个 512x512 像素的图标（PWA Manifest 图标）
- 一个适用于 iOS/MacOS 的 180x180 图标（HTML 头部链接： `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` ）

我们还建议您添加以下内容:

- 一个适用于 Windows（Edge）的 64x64 图标（PWA Manifest 图标）
- A 512x512 icon for Android with `purpose: 'any'` (PWA Manifest icon)
- Avoid using `purpose: 'any maskable'` icon, as it is not supported by all browsers
- An `favicon.ico` and `favicon.svg`, check [Preset Minimal 2023](#preset-minimal-2023) for more details

### Preset Minimal 2023 <Badge type="tip" text="新 从 v0.1.0" />

Refer to [Definitive edition of "How to Favicon" in 2023](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7) for more details.

Our minimal recommendation is:

- transparent 48x48 ico: register it in the html head: `<link rel="icon" href="/favicon.ico" sizes="48x48">`
- Use SVG image as source image: register it in the html head: `<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">`
- transparent 64x64 icon (PWA Manifest icon)
- transparent 192x192 icon (PWA Manifest icon)
- transparent 512x512 icon with `purpose: 'any'` (PWA Manifest icon)
- white 512x512 icon with `purpose: 'maskable'` (PWA Manifest icon): background color can be customized to your needs
- white 180x180 icon for iOS/MacOS (html head link: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`): background color can be customized to your needs

### Preset Minimal <Badge type="danger" text="已弃用 从 v0.1.0" />

Our minimal recommendation is:

- transparent 64x64 ico: register it in the html head: `<link rel="icon" href="/favicon.ico" sizes="any">`
- Use SVG image as source image: register it in the html head: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`
- transparent 64x64 icon (PWA Manifest icon)
- transparent 192x192 icon (PWA Manifest icon)
- transparent 512x512 icon with `purpose: 'any'` (PWA Manifest icon)
- white 512x512 icon with `purpose: 'maskable'` (PWA Manifest icon): background color can be customized to your needs
- white 180x180 icon for iOS/MacOS (html head link: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`): background color can be customized to your needs

## Example using minimal preset

You can generate icons using the `minimal-2023` preset included in [@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator) package via a source image, check out the [CLI](/assets-generator/cli) and [API](/assets-generator/api) documentation for more details.

Update your PWA manifest icons entry with:

```ts
icons: [
  {
    src: 'pwa-64x64.png',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: 'maskable-icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
];
```

and use the following HTML head entries in your entry point:

### Using Preset Minimal 2023 <Badge type="tip" text="新 从 v0.1.0" />

```html
<head>
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
</head>
```

### Using Preset Minimal <Badge type="danger" text="已弃用 从 v0.1.0" />

```html
<head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
</head>
```
