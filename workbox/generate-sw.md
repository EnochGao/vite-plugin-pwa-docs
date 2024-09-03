---
title: generateSW | Workbox
---

# generateSW

在 `vite-plugin-pwa` 插件上决定使用此策略之前，您必须阅读[使用哪种模式](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use)

你可以在 `workbox` 网站上找到这个方法的文档:[generateSW](https://developer.chrome.com/docs/workbox/modules/workbox-build#method-generateSW)

你可以在 `workbox` 网站上找到插件的使用指南：[使用插件](https://developer.chrome.com/docs/workbox/using-plugins/)

## 缓存外部资源

如果你使用一些 `CDN` 来下载一些资源，比如 `fonts` 和 `css` ，你必须将它们包含在 service worker 预缓存中，这样你的应用程序在离线时也能正常运行

下面案例将使用来自 `https://fonts.googleapis.com` 的 `css` 和 `https://fonts.gstatic.com` 的 `fonts` .

在 `index.html` 文件中，您必须配置 `css` 和 `link` ，并且**必须**为外部资源（参见[处理第三方请求](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime#cross-origin_considerations)）包含 `crossorigin="anonymous"` 属性：

::: details index.html

```html
<head>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
  <link
    rel="preconnect"
    crossorigin="anonymous"
    href="https://fonts.googleapis.com"
  />
  <link
    rel="preconnect"
    crossorigin="anonymous"
    href="https://fonts.gstatic.com"
  />
  <link
    rel="stylesheet"
    crossorigin="anonymous"
    href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
  />
</head>
```

:::

然后在您的 `vite.config.ts` 文件中添加以下代码：

::: details VitePWA 选项

```ts
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});
```

:::

## 排除路由

为了防止某些路由被 service worker 拦截，您只需将这些路由通`过正则匹配`添加到 `workbox` 的 `navigateFallbackDenylist` 选项列表中即可:

```ts
VitePWA({
  workbox: {
    navigateFallbackDenylist: [/^\/backoffice/],
  },
});
```

::: warning 警告

你必须处理那些被排除路由的离线支持：如果请求 `navigateFallbackDenylist` 页面上的内容，你将得到 `No internet connection`
:::

## Background Sync

你可以在你的 `vite.config.ts` 文件中给插件中添加以下代码，以为您的 service worker 添加一个 `Background Sync` 管理器：

::: details VitePWA 选项

```ts
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        handler: 'NetworkOnly',
        urlPattern: /\/api\/.*\/*.json/,
        method: 'POST',
        options: {
          backgroundSync: {
            name: 'myQueueName',
            options: {
              maxRetentionTime: 24 * 60,
            },
          },
        },
      },
    ],
  },
});
```

:::
