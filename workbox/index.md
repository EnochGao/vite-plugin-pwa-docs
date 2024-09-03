---
title: 开始 | Workbox
prev:
  text: Apache Http Server 2.4+ | 部署
  link: /deployment/apache
---

# 开始

[**Workbox**](https://developer.chrome.com/docs/workbox/) 是一个包含许多模块的大型包，可以使 service worker 开发更加便捷，并消除处理底层 service worker API 的需要。

在本文档中，我们只关注**Workbox**中的 [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build)模块

:::warning 警告

从版本 `0.16.0`， `vite-plugin-pwa` 已更新为使用最新的 `workbox` 版本`7.0.0` ，需要 Node 16 或以上。
:::

:::tip 提示

从版本 `0.20.2` 开始，如果在构建 service worker 时出现 `maximumFileSizeToCacheInBytes` 警告，插件将抛出错误。

:::

## workbox-build 模块

这个模块用于构建过程(一个 `node` 模块);也就是说， `Vite Plugin PWA` 将使用它来构建你的 service-worker。

我们关注这个模块的两个方法：

- [generateSW](/workbox/generate-sw): 用于生成 service worker.
- [injectManifest](/workbox/inject-manifest): 用于当你需要对 service worker 进行更多控制时.

在决定使用哪种策略之前，您应该先阅读[使用哪种模式](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use)

简而言之， `generateSW` 函数在构建 service worker 时抽象了直接使用 service worker API 的需求。这个方法可以使用插件来配置，而不是编写自己的 service worker 代码( `generateSW` 将为您生成代码)。

而 `injectManifest` 方法将使用您现有的 service worker 并构建/编译它

## `workbox-build`与`vite-plugin-pwa`的关系如何

当`strategies` 选项分别设置为 `generateSW` 和 `injectManifest` 时，`vite-plugin-pwa` 在内部使用 Workbox 的 `generateSW` 和 `injectManifest` 方法。

当你在 `vite.config.*`文件中配置 `strategies: 'generateSW'` 选项(默认值)时，插件会调用 `workbox` 的 `generateSW` 方法。传递给 `workbox-build`方法的选项将是通过插件配置的 `workbox` 选项提的。

当你配置 `strategies: 'injectManifest'` 选项时，插件将首先通过自定义 `Vite` 构建你的自定义 service worker。对于构建结果，vite-plugin-pwa 将调用 Workbox 的 `injectManifest` 方法，传递通过插件配置的 `injectManifest` 选项提供的那些选项。
