---
title: Service Worker 策略和行为 | 指南
---

# Service Worker 策略和行为

service worker 策略与 `vite-plugin-pwa`插件将如何生成你的 service worker 有关，而 service worker 的行为与浏览器检测到应用程序的新版本后 service worker 将如何在浏览器中工作有关

## Service Worker 策略

正如我们在 [配置 vite-plugin-pwa](/guide/#配置-vite-plugin-pwa) 部分提到, `vite-plugin-pwa` 插件会使用 `workbox-build` node 库 来生成你的 service worker。这有两种可用的策略, `generateSW` 和 `injectManifest`:

- `generateSW`: `vite-plugin-pwa`将为你生成 service worker，你不需要为 service worker 编写代码
- `injectManifest`: `vite-plugin-pwa` 插件将编译你的自定义 service worker 并注入它的预缓存清单

要配置 service worker 策略，请使用带有`generateSW` (**默认策略**)或 `injectManifest`的`strategies` 插件选项

您可以在 [generateSW](/workbox/generate-sw) 或 [injectManifest](/workbox/inject-manifest) `Workbox` 部分中找到有关策略的更多信息。

## Service Worker 行为

service worker 的行为将帮助您在浏览器中更新应用程序，即当浏览器检测到应用程序的新版本时，您可以控制浏览器如何更新它

你可能不想打扰用户，只是让浏览器在有新版本时更新应用程序:用户只会看到他们所在页面的重新加载

或者你可能想通知用户应用程序有一个新版本，让用户决定何时更新它:只是你希望它有那样的行为，或者你的应用程序确实需要这样做(例如，防止用户在填写表单时丢失数据)。

要配置 service worker 的行为，使用带有`autoUpdate` 或 `prompt` (**默认策略**)的`registerType` 插件选项

你可以在 `generateSW` 策略的[auto-update](/guide/auto-update)或[prompt-for-update](/guide/prompt-for-update)部分，或 `injectManifest` 策略的[inject-manifest](/guide/inject-manifest)部分中找到有关行为的更多信息。
