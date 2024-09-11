---
title: 开始 | 示例
prev: Remix | 框架
---

# 开始

在 [Vite Plugin PWA GitHub repo](https://github.com/antfu/vite-plugin-pwa/tree/main/examples)你可以找到一系列示例项目.

所有的示例项目都在仓库根目录的 `examples` 包/目录中.

::: info 信息
The main purpose of these examples projects is to test the service worker and not to meet the [PWA 最低要求](/guide/pwa-minimal-requirements), that is, if you use any of these examples for your projects, you will need to modify the code supplied and then test that it meets the [PWA 最低要求](/guide/pwa-minimal-requirements). Almost all the examples projects should meet [PWA 最低要求](/guide/pwa-minimal-requirements), but you must check it on your target project.

All the examples projects use `@rollup/plugin-replace` to configure a timestamp initialized to `now` on each build, and so, the service worker will be regenerated/versioned on each build: this timestamp will help us since the service worker won't be regenerated/versioned if none source code changed (on your project you shouldn't want this behavior, you should want to only regenerate/version the service worker when your source code change).
:::

::: warning TRY TO AVOID INCLUDING AUTOMATIC TIMESTAMP ON YOU APPLICATION IF YOU DON'T CHANGE YOUR CODE
We use the timestamp in the examples projects to avoid having to touch a file each time we need to test: for example, to test `Prompt for update`, we need to install the service worker first time (first build), then rebuild and restart the example project and finally refresh the browser to check the `Prompt for update` is shown.
:::

## 如何运行示例项目?

如果你想运行任何示例项目，你需要把`Vite Plugin PWA GitHub repo`下载/克隆到本地计算机。

你需要 `node 14` (或更新的)才能构建 `Vite Plugin PWA`。

::: warning 警告

在遵循下面的说明之前，请阅读[Contribution 指南](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md)。
:::

如果你还没有安装 `PNPM`, 你必须首先安装 `npm`:

```shell
npm install -g pnpm
```

一旦仓库在本地机器上，您必须安装项目依赖项并构建 `vite-plugin-pwa` 插件，只需运行(在克隆的本地 `vite-plugin-pwa` 目录):

```shell
pnpm install
pnpm run build
```

我们使用 `PNPM` ，但应该适用于任何 `package manager` ，例如 `YARN` :

```shell
yarn && yarn build
```

::: info 信息
From here on, we will only show the commands to run the examples projects using `PNPM`, we leave it to you how to execute them with any other` package manager`.
:::

Before we start running the examples projects, you should consider the following:

- Use `Chromium based` browser: `Chrome`, `Chromium` or `Edge`
- All the examples that are executed in this guide will be done over https, that is, all the projects will respond at address `https://localhost`
- When testing an example project, the `service worker` will be installed in `https://localhost`, and so, subsequent tests in another examples projects may interfere with the previous test, because the `service worker` of the previous project will keep installed on the browser
- Tests should be done on a private window, and so, browser addons/plugins will not interfere with the test

To avoid `service worker` interference, you should do the following tasks when switching between examples projects:

- Open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on `Windows/Linux`)
- Go to `Application > Storage`, you should check following checkboxes:
  - Application: [x] Unregister service worker
  - Storage: [x] Local and session storage
  - Cache: [x] Cache storage and [x] Application cache
- Click on `Clear site data` button
- Go to `Application > Service Workers` and check the current `service worker` is missing or has the state `deleted`

Once we remove the `service worker`, run the corresponding script and just press browser `Refresh` button (or enter `https://localhost` on browser address).

## 如何测试示例项目离线?

To test any of the examples projects (or your project) on `offline`, just open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on `Windows/Linux`) and go to `Application > Network`, then locate `No throttling` selector: open it and select `Offline` option.

A common pitfall is to select `Offline` option, then restart the example project (or your project), and refresh the page. In that case, you will have unexpected behavior, and you should remove the service worker.

If you click the browser `Refresh` button, you can inspect `Application > Network` tab on `dev tools` to check that the `Service Worker` is serving all assets instead request them to the server.

::: danger 危险
Don't do a `hard refresh` since it will force the browser to go to the server, and then you will get `No internet connection` page.
:::

## 可用的示例项

<RunExamples />

我们提供下面示例项目:

- [Vue 3](/examples/vue)
  - [Vue 3 generateSW Router Examples](/examples/vue#generatesw): 一组具有不同行为的示例
  - [Vue 3 injectManifest Router Examples](/examples/vue#generatesw): 一组具有不同行为的示例
- [React](/examples/react)
  - [React generateSW Router Examples](/examples/react#generatesw): 一组具有不同行为的示例
  - [React injectManifest Router Examples](/examples/react#generatesw): 一组具有不同行为的示例
- [Svelte](/examples/svelte)
  - [Svelte generateSW Router Examples](/examples/svelte#generatesw): 一组具有不同行为的示例
  - [Svelte injectManifest Router Examples](/examples/svelte#generatesw): 一组具有不同行为的示例
- [SvelteKit](/examples/sveltekit)
- [SolidJS](/examples/solidjs)
  - [SolidJS generateSW Router Examples](/examples/solidjs#generatesw): 一组具有不同行为的示例
  - [SolidJS injectManifest Router Examples](/examples/solidjs#generatesw): 一组具有不同行为的示例
- [Preact](/examples/preact)
  - [Preact generateSW Router Examples](/examples/preact#generatesw): 一组具有不同行为的示例
  - [Preact injectManifest Router Examples](/examples/preact#generatesw): 一组具有不同行为的示例
- [VitePress](/examples/vitepress).
- [îles](/examples/iles): 更新提示
- [Astro](/examples/astro).
