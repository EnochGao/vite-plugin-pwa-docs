从插件版本 `0.11.2` 开始，service worker 的源码映射将不会被生成，因为它使用了 vite 配置选项`build.sourcemap`来构建，默认情况下为 `false`

当 vite 的`build.sourcemap`配置选项为`true`、`'inline'`或`'hidden'`时，并且你没有配置`workbox.sourcemap`选项，service worker 的源码映射将被生成。如果你配置了`workbox.sourcemap`选项，插件将不会改变该值。

如果你想生成 service worker 的源码映射，你可以使用以下代码

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        sourcemap: true,
      },
    }),
  ],
});
```
