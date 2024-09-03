---
title: 开发 | 指南
---

# 开发

从`v0.11.13`版本你可以在开发环境使用 service worker.

PWA 不会被注册，只会注册 Service Worker 逻辑，请查看下面每个策略的详细信息。

::: warning 警告

必要时，service worker 的预缓存清单(`self.__WB_MANIFEST`)中只会有一个注册:`navigatfallback`
:::

在开发过程中，service worker 仅在插件`disabled` 选项不是`true`且`enable`选项被设置为`true`的情况下才可用。

## 插件配置

要在开发中启用 service worker，你只需要在插件配置中添加以下选项：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      /* 其他选项 */
      /* 开发环境启用 sw */
      devOptions: {
        enabled: true,
        /* 其他选项 */
      },
    }),
  ],
});
```

## 类型声明

::: warning 警告

自版本`0.12.4+` 起， `webManifestUrl` 已被弃用，该插件将使用 `navigateFallbackAllowlist` 替代

:::

```ts
/**
 * 开发选项
 */
export interface DevOptions {
  /**
   * 开发环境sw 是否启用?.
   *
   * @default false
   */
  enabled?: boolean;
  /**
   *  service worker 类型.
   *
   * @default 'classic'
   */
  type?: WorkerType;
  /**
   * This option will enable you to not use the `runtimeConfig` configured on `workbox.runtimeConfig` plugin option.
   *
   * **警告**: 这个选项仅用在 `generateSW` 策略.
   *
   * @default false
   */
  disableRuntimeConfig?: boolean;
  /**
   * 这个选项将允许你配置 `navigateFallback` 当使用 `registerRoute` 为了支持 `offline`:
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **警告**:  这个选项仅用在 `injectManifest` 策略.
   */
  navigateFallback?: string;

  /**
   * 这个选项将允许你配置 `navigateFallbackAllowlist`: 新选项子版本 `v0.12.4`.
   *
   * Since we need at least the entry point in the service worker's precache manifest, we don't want the rest of the assets to be intercepted by the service worker.
   *
   * 如果你配置了这个选项，插件将使用它代替默认值。
   *
   * **警告**: 这个选项仅用在 `generateSW` 策略.
   *
   * @default [/^\/$/]
   */
  navigateFallbackAllowlist?: RegExp[];

  /**
   * 在开发模式 `manifest.webmanifest` 在其他路径.
   *
   * 例如, **SvelteKit** 将会请求 `/_app/manifest.webmanifest`, when `webmanifest` added to the output bundle, **SvelteKit** will copy it to the `/_app/` folder.
   *
   * **警告**: 这个选项仅用在 `generateSW` 策略.
   *
   * @default `${vite.base}${pwaOptions.manifestFilename}`
   * @deprecated 这个选项自 `v0.12.4`已弃用, 插件将使用 navigateFallbackAllowlist 代替.
   * @see navigateFallbackAllowlist
   */
  webManifestUrl?: string;
}
```

## manifest.webmanifest

由于`0.12.1` 版本`manifest.webmanifest` 也服务于开发模式:你现在可以在`dev tools`上检查它。

## generateSW 策略

在使用此策略时，开发选项中的 `navigateFallback` 将被忽略。PWA 插件将检查是否已配置 `workbox.navigateFallback` ，并仅在 `additionalManifestEntries` 上注册它

PWA 插件将强制 service worker 注册时使用`type: 'classic'`，以避免客户端出现错误（尚未支持）：

```shell
Uncaught (in promise) TypeError: Failed to execute 'importScripts' on 'WorkerGlobalScope': Module scripts don't support importScripts().
```

::: warning 警告

如果你的页面/路由被 service worker 截获了，使用 `navigateFallbackAllowlist` 只包含入口点:默认情况下，插件会使用`[/^\/$/]`。

如果你的页面/路由被 service worker 拦截，导致无法正常工作，你只需要在 `vite-plugin-pwa` 配置文件中的 `devOptions` 入口处添加 `navigateFallbackAllowlist` 选项即可。

```ts
export default defineConfig({
  plugins: [
    VitePWA({
      /* 其他选项 */
      devOptions: {
        navigateFallbackAllowlist: [/^index.html$/],
        /* 其他选项 */
      },
    }),
  ],
});
```

:::

## injectManifest 策略

你可以使用`type: 'module'`来注册 service worker (目前仅支持最新的基于 `Chromium` 的浏览器: Chromium/Chrome/Edge):

<!--eslint-skip-->

```ts
devOptions: {
  enabled: true,
  type: 'module',
  /* 其他选项*/
}
```

::: warning 警告

在构建应用程序时，`vite-plugin-pwa`插件将始终将您的 service worker 注册为`type: 'classic'` ，以确保与所有浏览器的兼容性。
:::

::: tip 提示

如果你没有在 `NavigationRoute` 中包含 `allowlist` 选项，你应该只拦截你的应用的入口点。否则，你的所有页面/路由可能无法正常工作，因为它们会被 service worker 拦截（它会默认返回不包含你的页面/路由的预缓存清单的内容）

```ts
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// 允许离线工作
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);
```

:::

在使用此策略时， `vite-plugin-pwa` 插件将把 service worker 的编译任务委托给 `Vite`，因此，如果您在自定义 service worker 中使用了 `import` 语句而不是 `importScripts` ，则必须在开发选项中配置`type: 'module'`。

如果你在自定义 service worker 中使用了 `registerRoute` ，那么在开发选项中添加 `navigateFallback` ， `vite-plugin-pwa` 插件将会将其包含在注入点（`self.__WB_MANIFEST`）中。

在自定义 service worker 中，您**不能**使用 `HMR (Hot Module Replacement)`，因为目前 service worker 还不能使用动态导入： `import.meta.hot`

如果你注册了自定义 service worker（未使用 `vite-plugin-pwa` 虚拟模块并配置了 `injectRegister: false` 或 `injectRegister: null` ），请使用以下代码（如有必要，请记得添加 `scope` 选项）

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw'
  );
}
```

如果你也使用 `import` 代替 `importScripts`， 请使用以下代码 (如果需要， 请记得添加 `scope` 选项):

```ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  );
}
```

当您更改 service worker 的代码时， Vite 会强制进行完全加载，因为我们使用 `workbox-window` 来注册它（默认情况下，您可以手动注册它），因此您可能会遇到一些 service worker 事件问题

<HeuristicWorkboxWindow />

## 示例

您可以在这找到示例: [vue-router](https://github.com/antfu/vite-plugin-pwa/tree/main/examples/vue-router).

要运行这个示例，您必须从根目录构建 PWA 插件（ `pnpm run build` ），切换到 `vue-router` 目录（`cd examples/vue-router` ）并运行它:

- `generateSW` 策略: `pnpm run dev`
- `injectManifest` 策略: `pnpm run dev-claims`

从版本 `0.12.1` 开始，您还可以获得所有其他框架的开发脚本

运行 `dev` 或 `dev-claims` 脚本的步骤与运行 `vue-router` 的步骤相同，但需要在相应的框架目录中运行它们。
