当用户安装应用程序的新版本时，我们会在 service worker 缓存中缓存所有新资产以及旧资产。要删除旧资产（来自不再需要的先前版本），由于您正在构建自己的 service worker，因此需要在自定义 service worker 中添加以下代码

```js
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);
```

我们强烈建议您在自定义 Service Worker 中包含以上代码
