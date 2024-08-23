---
title: 开发 | 指南
---

# 开发

从`v0.11.13`版本你可以在开发环境使用 service worker.

PWA 不会被注册，只会注册 Service Worker 逻辑，请查看下面每个策略的详细信息。

::: warning 警告
There will be only one single registration on the service worker precache manifest (`self.__WB_MANIFEST`) when necessary: `navigateFallback`.
:::

在开发过程中，service worker 仅在插件`disabled` 选项不是`true`且`enable`选项被设置为`true`的情况下才可用。

## 插件配置

要在开发中启用 service worker，你只需要在插件配置中添加以下选项：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      /* other options */
      /* enable sw on development */
      devOptions: {
        enabled: true,
        /* other options */
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
   * Should the service worker be available on development?.
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * The service worker type.
   *
   * @default 'classic'
   */
  type?: WorkerType;
  /**
   * This option will enable you to not use the `runtimeConfig` configured on `workbox.runtimeConfig` plugin option.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default false
   */
  disableRuntimeConfig?: boolean;
  /**
   * This option will allow you to configure the `navigateFallback` when using `registerRoute` for `offline` support:
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **WARNING**: this option will only be used when using `injectManifest` strategy.
   */
  navigateFallback?: string;

  /**
   * This option will allow you to configure the `navigateFallbackAllowlist`: new option from version `v0.12.4`.
   *
   * Since we need at least the entry point in the service worker's precache manifest, we don't want the rest of the assets to be intercepted by the service worker.
   *
   * If you configure this option, the plugin will use it instead the default.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default [/^\/$/]
   */
  navigateFallbackAllowlist?: RegExp[];

  /**
   * On dev mode the `manifest.webmanifest` file can be on other path.
   *
   * For example, **SvelteKit** will request `/_app/manifest.webmanifest`, when `webmanifest` added to the output bundle, **SvelteKit** will copy it to the `/_app/` folder.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default `${vite.base}${pwaOptions.manifestFilename}`
   * @deprecated This option has been deprecated from version `v0.12.4`, the plugin will use navigateFallbackAllowlist instead.
   * @see navigateFallbackAllowlist
   */
  webManifestUrl?: string;
}
```

## manifest.webmanifest

由于`0.12.1` 版本`manifest.webmanifest` 也服务于开发模式:你现在可以在`dev tools`上检查它。

## generateSW 策略

When using this strategy, the `navigateFallback` on development options will be ignored. The PWA plugin will check if `workbox.navigateFallback` is configured and will only register it on `additionalManifestEntries`.

The PWA plugin will force `type: 'classic'` on service worker registration to avoid errors on client side (not yet supported):

```shell
Uncaught (in promise) TypeError: Failed to execute 'importScripts' on 'WorkerGlobalScope': Module scripts don't support importScripts().
```

::: warning 警告
If your pages/routes other than the entry point are being intercepted by the service worker, use `navigateFallbackAllowlist` to include only the entry point: by default, the plugin will use `[/^\/$/]`.

You **ONLY** need to add the `navigateFallbackAllowlist` option to the `devOptions` entry in `vite-plugin-pwa` configuration if your pages/routes are being intercepting by the service worker and preventing to work as expected:

```ts
export default defineConfig({
  plugins: [
    VitePWA({
      /* other options */
      devOptions: {
        navigateFallbackAllowlist: [/^index.html$/],
        /* other options */
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
  /* other options */
}
```

::: warning 警告

在构建应用程序时，`vite-plugin-pwa`插件将始终将您的 service worker 注册为`type: 'classic'` ，以确保与所有浏览器的兼容性。
:::

::: tip 提示
You should only intercept the entry point of your application, if you don't include the `allowlist` option in the `NavigationRoute`, all your pages/routes might not work as they are being intercepted by the service worker (which will return by default the content of the entry point by not including your pages/routes in its precache manifest):

```ts
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);
```

:::

When using this strategy, the `vite-plugin-pwa` plugin will delegate the service worker compilation to `Vite`, so if you're using `import` statements instead `importScripts` in your custom service worker, you **must** configure `type: 'module'` on development options.

If you are using `registerRoute` in your custom service worker you should add `navigateFallback` on development options, the `vite-plugin-pwa` plugin will include it in the injection point (`self.__WB_MANIFEST`).

You **must** not use `HMR (Hot Module Replacement)` in your custom service worker, since we cannot use yet dynamic imports in service workers: `import.meta.hot`.

If you register your custom service worker (not using `vite-plugin-pwa` virtual module and configuring `injectRegister: false` or `injectRegister: null`), use the following code (remember also to add `scope` option if necessary):

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw'
  );
}
```

If you are also using `import` statements instead `importScripts`, use the following code (remember also to add the `scope` option if necessary):

```ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  );
}
```

When you change your service worker source code, `Vite` will force a full reload, since we're using `workbox-window` to register it (by default, you can register it manually) you may have some problems with the service worker events.

<HeuristicWorkboxWindow />

## 示例

您可以在这找到示例: [vue-router](https://github.com/antfu/vite-plugin-pwa/tree/main/examples/vue-router).

要运行这个示例，您必须从根目录构建 PWA 插件（ `pnpm run build` ），切换到 `vue-router` 目录（`cd examples/vue-router` ）并运行它:

- `generateSW` 策略: `pnpm run dev`
- `injectManifest` 策略: `pnpm run dev-claims`

从版本 `0.12.1` 开始，您还可以获得所有其他框架的开发脚本

运行 `dev` 或 `dev-claims` 脚本的步骤与运行 `vue-router` 的步骤相同，但需要在相应的框架目录中运行它们。
