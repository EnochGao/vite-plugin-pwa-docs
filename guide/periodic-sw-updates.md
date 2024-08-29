---
title: 定期更新 Service Worker  | 指南
---

# 定期更新 Service Worker

:::info 信息

如果你没有从 `vite-plugin-pwa` 中导入任何虚拟模块，那么你需要自行配置它，这不在本指南的范围内
:::

在[Service Worker 生命周期](https://web.dev/articles/service-worker-lifecycle) 一文的[手动更新](https://web.dev/articles/service-worker-lifecycle#manual_updates)一节中解释了如何使用以下代码在您的 `main.ts` 或`main.js` 上为您的应用程序配置定期 service worker 更新:

::: details main.ts / main.js

```ts
import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
});
```

:::

间隔必须以毫秒为单位，例如，上面的示例中将其配置为每小时检查 service worker

## 边缘情况处理

::: info 信息

从版本 `0.12.8+` 开始，我们新增了一个选项 `onRegisteredSW` ，而 `onRegistered` 已被弃用。如果 `onRegisteredSW` 存在， `onRegistered` 将永远不会被调用
:::

之前的脚本可以帮助您检查应用程序是否存在新版本，但是您还需要处理一些边缘情况，例如：

- 当调用 update 方法时，服务器出现故障
- 用户可以在任何时候断开网络连接。

为了解决之前的问题，可以使用下面这个更为复杂的片段:

::: details main.ts / main.js

```ts
import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (r.installing || !navigator) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await r.update();
      }, intervalMS);
  },
});
```

:::

<HeuristicWorkboxWindow />
