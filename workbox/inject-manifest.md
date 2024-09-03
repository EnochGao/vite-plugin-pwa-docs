---
title: injectManifest | Workbox
---

# injectManifest

在 `vite-plugin-pwa` 插件上决定使用此策略之前，您必须阅读[使用哪种模式](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use)

在编写您的自定义 service worker 之前，检查 `workbox` 是否可以使用 `generateSW` 策略为您生成代码，在`workbox`站点[Runtime Caching Entry](https://developer.chrome.com/docs/workbox/modules/workbox-build#type-RuntimeCaching)上寻找一些插件。

你可以在 `workbox` 网站上找到这个方法的文档: [injectManifest](https://developer.chrome.com/docs/workbox/modules/workbox-build#method-injectManifest)

:::warning 警告

从版本 `0.15.0` ， `vite-plugin-pwa` 使用 Vite 而不是 Rollup 构建您的自定义 service worker: 配置的 Vite 插件在 service worker 构建中重用，这可能会导致在 service worker 中生成坏代码。

如果您在自定义 service worker 中使用任何 Vite 插件逻辑，则需要为开发服务器和构建过程添加这些插件两次:

- Vite 插件
- `vite-plugin-pwa` 插件选项: `injectManifest.plugins`

`vite-plugin-pwa`现在使用与 Vite 相同的方法来构建 [WebWorkers](https://vitejs.dev/config/worker-options.html#worker-plugins)
:::

## 排除路由

为了排除某些路由被 service worker 拦截，你只需要使用 `regex` 数组将这些路由添加到 `NavigationRoute` 的 `denylist` 选项中：

```ts
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    denylist: [/^\/backoffice/],
  })
);
```

::: warning 警告

你必须处理排除路由的离线支持:如果请求 `denylist`包含的页面，你将得到 `No internet connection`

:::

## 网络优先策略

您可以使用以下代码创建您的自定义 service worker，以用于网络优先策略。我们还包括如何配置[Custom Cache Network Race Strategy](https://jakearchibald.com/2014/offline-cookbook/#cache--network-race).。

::: details VitePWA 选项

```ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
});
```

:::

::: warning 警告

你还需要在客户端逻辑中添加交互逻辑：[高级 (injectManifest)](/guide/inject-manifest)
:::

然后在你的 `src/sw.ts` 文件中，记住你还需要添加以下 `workbox` 依赖项为 `dev` 依赖项:

- `workbox-core`
- `workbox-routing`
- `workbox-strategies`
- `workbox-build`

::: details src/sw.ts

```ts
import { cacheNames, clientsClaim } from 'workbox-core';
import {
  registerRoute,
  setCatchHandler,
  setDefaultHandler,
} from 'workbox-routing';
import type { StrategyHandler } from 'workbox-strategies';
import { NetworkFirst, NetworkOnly, Strategy } from 'workbox-strategies';
import type { ManifestEntry } from 'workbox-build';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;
declare type ExtendableEvent = any;

const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html',
};

const cacheName = cacheNames.runtime;

function buildStrategy(): Strategy {
  if (race) {
    class CacheNetworkRace extends Strategy {
      _handle(
        request: Request,
        handler: StrategyHandler
      ): Promise<Response | undefined> {
        const fetchAndCachePutDone: Promise<Response> =
          handler.fetchAndCachePut(request);
        const cacheMatchDone: Promise<Response | undefined> =
          handler.cacheMatch(request);

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (debug) console.log(`Cannot fetch resource: ${request.url}`, e);
          });
          cacheMatchDone.then((response) => response && resolve(response));

          // Reject if both network and cache error or find no response.
          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then(
            (results) => {
              const [fetchAndCachePutResult, cacheMatchResult] = results;
              if (
                fetchAndCachePutResult.status === 'rejected' &&
                !cacheMatchResult.value
              )
                reject(fetchAndCachePutResult.reason);
            }
          );
        });
      }
    }
    return new CacheNetworkRace();
  } else {
    if (networkTimeoutSeconds > 0)
      return new NetworkFirst({ cacheName, networkTimeoutSeconds });
    else return new NetworkFirst({ cacheName });
  }
}

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;

const cacheEntries: RequestInfo[] = [];

const manifestURLs = manifest.map((entry) => {
  const url = new URL(entry.url, self.location);
  cacheEntries.push(
    new Request(url.href, {
      credentials: credentials as any,
    })
  );
  return url.href;
});

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries);
    })
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  // - clean up outdated runtime cache
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // clean up those who are not listed in manifestURLs
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          debug &&
            console.log(`Checking cache entry to be removed: ${request.url}`);
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request).then((deleted) => {
              if (debug) {
                if (deleted)
                  console.log(
                    `Precached data removed: ${request.url || request}`
                  );
                else
                  console.log(`No precache found: ${request.url || request}`);
              }
            });
          }
        });
      });
    })
  );
});

registerRoute(({ url }) => manifestURLs.includes(url.href), buildStrategy());

setDefaultHandler(new NetworkOnly());

// fallback to app-shell for document request
setCatchHandler(({ event }): Promise<Response> => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error());
      });
    default:
      return Promise.resolve(Response.error());
  }
});

// this is necessary, since the new service worker will keep on skipWaiting state
// and then, caches will not be cleared since it is not activated
self.skipWaiting();
clientsClaim();
```

:::

## 服务器推送通知

你应该查看一下 `workbox` 的文档： [Introduction to push notifications](https://web.dev/explore/notifications)。

你可以查看这个很棒的代码库 [Elk](https://github.com/elk-zone/elk)它使用了 `Server Push Notifications` 和一些其他很酷的 service worker 功能，如 [Web Share Target API](https://developer.chrome.com/docs/capabilities/web-apis/web-share-target)：使用`Nuxt 3`和 `vite-plugin-pwa`

## Background Sync

你应该查看一下 `workbox` 文档：阅读一下[Introducing to Background Sync](https://developer.chrome.com/blog/background-sync/)的内容。

你可以查看这个很棒的代码库[YT Playlist Notifier](https://github.com/jeffposnick/yt-playlist-notifier)，它使用了` Background Sync` 以及主要合作者[Workbox](https://developer.chrome.com/docs/workbox/)提供的其他一些酷炫的 service worker 功能。
