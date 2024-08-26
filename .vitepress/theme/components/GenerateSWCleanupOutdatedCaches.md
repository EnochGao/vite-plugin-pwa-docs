当浏览器检测并安装新版本的应用程序时，它将在缓存中存储所有新资产和旧资产。要删除旧的资产(先前不再需要的版本)，您必须在插件配置的`workbox`条目中配置一个选项。

当使用 `generateSW` 策略时，无需配置，插件会默认激活

我们强烈建议您**不要**停用该选项。如果你却是想要禁用，可以在插件配置中使用以下代码来禁用它:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: false,
      },
    }),
  ],
});
```
