---
title: 更新日志 | 指南
outline: deep
---

# 更新日志

请参阅相应的安装部分:

- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa#-install)
- [@vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit#-install)
- [@vite-pwa/vitepress](https://github.com/vite-pwa/vitepress#-install)
- [@vite-pwa/astro](https://github.com/vite-pwa/astro#-install)
- [@vite-pwa/nuxt](https://github.com/vite-pwa/nuxt#-install)
- [@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator#-install)

## Service worker 构建 <Badge type="tip" text="从 v0.20.2" />

从 `v0.20.2` 开始，如果在构建 service worker 时出现 `maximumFileSizeToCacheInBytes` 警告，插件将抛出错误。

## Workbox 7.1.0 <Badge type="tip" text="从 v0.20.0" />

从 `v0.20.0` 、 `vite-plugin-pwa` 更新 `workbox` 为 `7.1.0`。

Workbox 已弃用[workbox-google-analytics](https://developer.chrome.com/docs/workbox/modules/workbox-google-analytics/)，它不再兼容较新的 Google Analytics v4。

## 更新 Vite 构建 <Badge type="tip" text="从 v0.19.6" />

**这些新功能只能在集成时使用**

From `v0.19.6`, `vite-plugin-pwa` adds `envOptions` option to `injectManifest` to allow customizing the environment options for the service worker build output:

- `envDir`: you can change the `envDir`, the plugin will use the Vite's [envDir](https://vitejs.dev/config/shared-options.html#envdir) option if not configured
- `envPrefix`: you can change the `envPrefix`, the plugin will use the Vite's [envDir](https://vitejs.dev/config/shared-options.html#envprefix) option if not configured

`vite-plugin-pwa` also includes the new `configureCustomSWViteBuild` integration option to allow you to change the Vite's build options for the custom service worker build, check the [PWAIntegration type](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/types.ts) definition for more details.

## PWA Assets <Badge type="tip" text="从 v0.19.0" /> <Badge type="warning" text="实验性的" />

从 `v0.19.0` ， `vite-plugin-pwa` 增加了对`@vite-pwa/assets-generator` 的实验支持，以动态地服务、生成和注入 PWA 资产。

更多信息请查看 [PWA Assets 生成器集成](/assets-generator/integrations)

## 新的 Vite 构建 <Badge type="tip" text="从 v0.18.0" />

<InjectManifestBuild />

## Rollup 4 和 Vite 5

Rollup 4 has changed the asset name layout format, it is using `ascii` letters (no encoding, including also dash and underscore), previous Rollup versions are using `hex` encoding:

- [Using more characters can make the hash length shorter](https://github.com/rollup/rollup/issues/4803)
- [Using a faster hash algorithm can make hashing faster](https://github.com/rollup/rollup/issues/4626)
- This is the PR that changed the hash algorithm: https://github.com/rollup/rollup/pull/5155

This change breaks the way `vite-plugin-pwa` build plugin builds the service worker, since it is using this regular expression `/[.-][a-f0-9]{8}\./` for [dontCacheBustURLsMatching](https://developer.chrome.com/docs/workbox/reference/workbox-build/) in `workbox` and `injectManifest` options.

From version `v0.17.0`, `vite-plugin-pwa` configures `dontCacheBustURLsMatching` with a regular expression using the Vite's [build.assetsDir](https://vitejs.dev/config/build-options.html#build-assetsdir) option (defaults to `assets`):

- `workbox.dontCacheBustURLsMatching = /^assets\//`
- `injectManifest.dontCacheBustURLsMatching = /^assets\//`

You can refer to this issue for more details about `dontCacheBustURLsMatching`: [Workbox appears to be needlessly generating revision hashes](https://github.com/vite-pwa/vite-plugin-pwa/issues/163).

## @vite-pwa/vitepress

From version `v0.3.0`, `@vite-pwa/vitepress` configures `dontCacheBustURLsMatching` in a similar way to how `vite-plugin-pwa` does, but using the VitePress' [assetsDir](https://vitepress.dev/reference/site-config#assetsdir) option (defaults to `assets`).

## @vite-pwa/nuxt

From version `v0.4.0`, `@vite-pwa/nuxt` requires Vite 5 and Nuxt 3.9+.

From version `v0.3.3`, `@vite-pwa/nuxt` configures `dontCacheBustURLsMatching` in a similar way to how `vite-plugin-pwa` does, but using the Nuxt's [app.buildAssetsDir](https://nuxt.com/docs/api/nuxt-config#buildassetsdir) option (defaults to `_nuxt`).

## @vite-pwa/astro

From version `v0.3.1`, you can use `import.meta.env.PUBLIC_` variables in your custom service worker when configured using [.env files](https://docs.astro.build/en/guides/environment-variables/#setting-environment-variables).

From version `v0.2.0`, `@vite-pwa/astro` configures `dontCacheBustURLsMatching` in a similar way to how `vite-plugin-pwa` does, but using the Astro's [build.assets](https://docs.astro.build/en/reference/configuration-reference/#buildassets) option (defaults to `_astro`).

## @vite-pwa/sveltekit

From version `v0.3.0`, `@vite-pwa/sveltekit` supports SvelteKit 2 (should also support SvelteKit 1).

From version `v0.2.9`, `@vite-pwa/sveltekit` configures `dontCacheBustURLsMatching` in a similar way to how `vite-plugin-pwa` does, but using the Sveltkit's [appDir](https://kit.svelte.dev/docs/configuration#appdir) option (defaults to `_app`).

::: warning 警告

从版本 `v0.2.0` ， `SvelteKitPWA` 插件需要 SvelteKit 1.3.1 或以上版本。

如果你使用的是 `v1.3.1` 之前的 SvelteKit 版本，你应该使用 `SvelteKitPWA` `0.1.*`插件版本 。
:::

## 其他集成

如果您正在使用 `vite-plugin-pwa` 或与其他元框架的集成(îles)，如果您正在使用 Vite 5 或 Rollup 4，请检查生成的 service worker，并在需要时适当更新 `dontCacheBustURLsMatching` 正则表达式。
