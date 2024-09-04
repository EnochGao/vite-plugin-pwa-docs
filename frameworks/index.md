---
title: 开始 | 框架
prev: 迁移 | PWA Assets 生成器
---

# 开始

::: tip 提示
如果你使用的是默认的 `registerType` （即 `prompt` ），并且想要提示用户重新加载，那么你可以使用我们的框架模块

但是如果你:

1. 使用 `autoUpdate`
2. 不喜欢 `autoUpdate` ，也觉得没有必要提示
3. 使用 `injectManifest`

那么，你就**不需要**学习框架相关的知识了
:::

这个插件与框架无关，所以你可以在原生 JavaScript、TypeScript 和任何框架中使用它。

## 类型声明

你可以在以下类型[types.ts module](https://github.com/antfu/vite-plugin-pwa/blob/main/client.d.ts)中找到所有的 `vite-plugin-pwa` 虚拟模块声明。

::: tip 提示
<TypeScriptError2307 />

从版本 `0.14.5` 开始，你还可以为每个框架使用类型定义，而不是使用 `vite-plugin-pwa/client` ，只包括以下类型之一:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/react",
      "vite-plugin-pwa/preact",
      "vite-plugin-pwa/solid",
      "vite-plugin-pwa/svelte",
      "vite-plugin-pwa/vanillajs",
      "vite-plugin-pwa/vue"
    ]
  }
}
```

或者你可以在 `d.ts` 文件中添加以下引用之一(例如，在 `vite-env.d.ts` 或 `global.d.ts` 中):

```ts
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/preact" />
/// <reference types="vite-plugin-pwa/solid" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/vue" />
```

:::

```ts
declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function registerSW(
    options?: RegisterSWOptions
  ): (reloadPage?: boolean) => Promise<void>;
}
```

其中 `vite-plugin-pwa/types` 为:

```ts
export interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  /**
   * Called only if `onRegisteredSW` is not provided.
   *
   * @deprecated Use `onRegisteredSW` instead.
   * @param registration The service worker registration if available.
   */
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  /**
   * Called once the service worker is registered (requires version `0.12.8+`).
   *
   * @param swScriptUrl The service worker script url.
   * @param registration The service worker registration if available.
   */
  onRegisteredSW?: (
    swScriptUrl: string,
    registration: ServiceWorkerRegistration | undefined
  ) => void;
  onRegisterError?: (error: any) => void;
}
```

## 访问 PWA 信息

从版本 `0.12.8` ， `vite-plugin-pwa` 暴露了一个新的 Vite 虚拟模块来访问 PWA 信息: [virtual:pwa-info](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/info.d.ts).

如果你的 **TypeScript** 在构建过程中或 **IDE** 抱怨无法在导入中找到模块或类型定义，请将以下内容添加到 `tsconfig.json` 的`compilerOptions.types` 数组中:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/info"]
  }
}
```

或者你可以在任何 `d.ts` 文件中添加以下引用(例如，在 `vite-env.d.ts` 或 `global.d.ts` 中):

```ts
/// <reference types="vite-plugin-pwa/info" />
```

## 导入虚拟模块

`vite-plugin-pwa` 插件暴露了一个 `Vite` 虚拟模块与 service worker 交互

::: tip 提示

当需要与用户交互时，需要导入 `vite-plugin-pwa` 插件公开的虚拟模块，否则，不需要导入任何虚拟模块，也就是说，当使用 `registerType: 'prompt'` 或使用 `registerType: 'autoUpdate'` 时，需要通知用户应用程序准备离线工作时
:::

### 自动更新

当你配置 `registerType: 'autoUpdate'` 时，你必须导入虚拟模块，并且你希望你的应用程序在应用程序准备好`离线`工作时通知用户 :

```ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onOfflineReady() {},
});
```

Y
你需要在 `onOfflineReady` 方法中向用户展示一个准备离线工作的提示信息，并包含一个`确定`按钮。

当用户点击 `确定` 按钮时，请将 `onOfflineReady` 方法中显示的提示隐藏

### 更新提示

在使用 `registerType: 'prompt'` 时，您**必须**导入虚拟模块：

```ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});
```

你需要:

- 在 `onNeedRefresh` 方法中向用户显示带有刷新和取消按钮的提示框
- 在 `onOfflineReady` 方法中向用户显示一个准备离线工作的提示信息，并包含一个`确认`按钮

当 `onNeedRefresh`被调用，用户点击 `刷新` 按钮时，然后会调用 `updateSW()` 函数；页面将重新加载，并提供最新的内容

无论如何，当用户点击 `取消` 或 `确认` 按钮时，分别关闭与 `onNeedRefresh` 或 `onOfflineReady` 相对应显示的提示框。

## 自定义 Vite 虚拟模块

`vite-plugin-pwa` 插件也为 [Vue 3](https://v3.vuejs.org/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/docs), [SolidJS](https://www.solidjs.com/) 和 [Preact](https://preactjs.com/)提供了一套虚拟模块.

这些自定义虚拟模块将使用框架<code>响应式系统</code>为 <code>virtual:pwa-register</code> 提供一个封装器，即：

- <code>virtual:pwa-register/vue</code>: [ref](https://v3.vuejs.org/api/refs-api.html#ref) 给 <code>Vue 3</code>
- <code>virtual:pwa-register/react</code>: [useState](https://reactjs.org/docs/hooks-reference.html#usestate) 给 <code>React</code>
- <code>virtual:pwa-register/svelte</code>: [writable](https://svelte.dev/docs#writable) 给 <code>Svelte</code>
- <code>virtual:pwa-register/solid</code>: [createSignal](https://www.solidjs.com/docs/latest/api#createsignal) 给 <code>SolidJS</code>
- <code>virtual:pwa-register/preact</code>: [useState](https://preactjs.com/guide/v10/hooks#usestate) 给 <code>Preact</code>

**注意**: 对于 [Vue 2](https://vuejs.org/) 你需要使用[Vue 2](/frameworks/vue#vue-2)提供的自定义 `mixin` 部分.

## 框架

这些自定义虚拟模块将使用框架<code>响应式系统</code>为 <code>virtual:pwa-register</code> 提供一个封装器，即：

- [Vue](/frameworks/vue)
- [React](/frameworks/react)
- [Svelte](/frameworks/svelte)
- [SvelteKit](/frameworks/sveltekit)
- [SolidJS](/frameworks/solidjs)
- [Preact](/frameworks/preact)
- [VitePress](/frameworks/vitepress)
- [îles](/frameworks/iles)
- [Astro](/frameworks/astro)
- [Nuxt 3](/frameworks/nuxt)
