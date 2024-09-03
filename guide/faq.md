---
title: 常见问题解答 | 指南
next: 开始 | PWA 资产生成器
---

# 常见问题解答

## IDE 错误 'Cannot find module' (ts2307)

<TypeScriptError2307 />

## 类型声明

您可以在以下[types.ts module](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts)中找到 `vite-plugin-pwa` 插件配置选项的完整列表。

你可以在下面的[client.d.ts](https://github.com/antfu/vite-plugin-pwa/blob/main/client.d.ts)中找到所有 `vite-plugin-pwa` 虚拟模块声明。

## Web 应用清单和 401 状态码(未授权)

[浏览器发送的 web 清单请求没有凭据](https://web.dev/articles/add-manifest#link-manifest)，如果你的网站在认证后 ，请求将失败，返回一个 401 Unauthorized error —— 即使用户已经登录了

要发送带有凭据的请求， `<link rel="manifest">` 需要 `crossorigin="use-credentials"` 属性，你可以通过[插件选项](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts#L79)中的 `useCredentials` 来启用该属性:

```ts
useCredentials: true;
```

## Service Worker errors on browser

<ServiceWorkerClientErrors />

## Error: Unable to find a place to inject the manifest

如果你没有 `precaching` (`self.__WB_MANIFEST`)来自定义 service worker，并且在构建过程中出现此错误，你需要在 pwa 插件配置中禁用 `injection point` (仅从版本 `^0.14.0` 中可用):

```ts
injectManifest: {
  injectionPoint: undefined;
}
```

## Service Worker Registration Errors

如果你想通知用户处理 Service Worker 注册错误，可以在 `main.ts` 或 `main.js` 中使用以下代码：

```ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onRegisterError(error) {},
});
```

然后在 `onRegisterError` 内部，只需通知用户注册 service worker 时出现了错误。

## Missing assets from SW precache manifest

:::tip 提示

从版本 `0.20.2` 开始，如果在构建服务工人时出现 `maximumFileSizeToCacheInBytes` 警告，该插件将抛出错误。
:::

如果你发现 service worker 的预缓存清单中缺少任何资产，你应该检查一下它们是否超过了 `maximumFileSizeToCacheInBytes` ，默认值为 **2 MiB**

你可以根据自己的需要增加这个值，例如将资产限制在 **3MiB** 以内

- 在使用 `generateSW` 策略时:

```ts
workbox: {
  maximumFileSizeToCacheInBytes: 3000000;
}
```

- 在使用 `injectManifest` 策略时:

```ts
injectManifest: {
  maximumFileSizeToCacheInBytes: 3000000;
}
```

## 排除路由

如果你需要将某些路由排除在 service worker 拦截之外:

- [for `generateSW` strategy](/workbox/generate-sw#排除路由)
- [for `injectManifest` strategy](/workbox/inject-manifest#排除路由)

## `navigator / window` is `undefined`

如果你在构建应用程序时遇到了 `navigator is undefined` 或 `window is undefined` 错误，那么你的应用程序是在 `SSR / SSG` 环境下配置的

这种错误可能是由于使用了不支持`SSR/SSG`的插件或库导致的：您的代码将在客户端和构建过程中的服务器端被调用，因此在构建应用程序时，服务器端的逻辑将被调用，但是在服务器端没有`navigator/window`，所以它是`undefined`。

### 第三方库

如果错误的原因是第三方库不知道 `SSR / SSG` 环境，解决错误的方法是在定义 `window` 时使用动态导入来导入它:

```ts
if (typeof window !== 'undefined') import('./library-not-ssr-ssg-aware');
```

或者，如果你的框架支持组件 `onMount / onMounted` 生命周期钩子，你可以在回调中导入第三方库，因为框架应该只在客户端调用这个生命周期钩子，你应该检查你的框架文档

### Vite PWA Virtual Module

如果错误是由此插件的虚拟模块引起的，您可以按照 [SSR/SSG: Prompt for update](/guide/prompt-for-update#ssr-ssg) [SSR/SSG: Automatic reload](/guide/auto-update#ssr-ssg)方式来解决此问题。

如果您使用的是 `autoUpdate` 策略和支持 `isReady` 的`router`（即路由器允许在当前组件路由完成加载时注册一个回调），您可以延迟 service worker 注册到路由器回调上。

例如，使用 `vue-router`，您可以使用以下代码为 `autoUpdate` 策略注册 service worker

```ts
import type { Router } from 'vue-router';

export function registerPWA(router: Router) {
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({ immediate: true });
  });
}
```

在 [Vitesse Template](https://github.com/antfu/vitesse/blob/main/src/modules/pwa.ts) 中可以看到一个`SSR / SSG` 环境([vite-ssg](https://github.com/antfu/vite-ssg))的`autoUpdate`策略示例。

如果你正在使用`prompt`策略，你将需要使用异步的方式来动态导入来加载 `ReloadPrompt` 组件，例如，使用 `vue 3`:

```vue
// src/App.vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const ClientReloadPrompt =
  typeof window !== 'undefined'
    ? defineAsyncComponent(() => import('./ReloadPrompt.vue'))
    : null;
</script>

<template>
  <router-view />
  <template v-if="ClientReloadPrompt">
    <ClientReloadPrompt />
  </template>
</template>
```

或者使用 `svelte`:

```html
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  let ClientReloadPrompt;
  onMount(async () => {
    typeof window !== 'undefined' && (ClientReloadPrompt = await import('$lib/ReloadPrompt.svelte')).default)
  })
</script>
... {#if ClientReloadPrompt}
<svelte:component this="{ClientReloadPrompt}" />
{/if}
```

您可以检查 `SSR / SSG` 环境，看看它是否提供了一些仅在客户端注册组件的方法。接下来是 `Vitesse Template`上的 `vite-ssg`，它提供了 `ClientOnly` 功能组件，这将防止在服务器端注册组件，所以你可以使用原始代码，包含 `ReloadPrompt` 组件:

```vue
// src/App.vue
<template>
  ...
  <ClientOnly>
    <ReloadPrompt />
  </ClientOnly>
</template>
```

### VitePress

你可以查看这个网站的 [ReloadPrompt](https://github.com/antfu/vite-plugin-pwa/blob/main/docs/.vitepress/theme/components/ReloadPrompt.vue) 组件来调用 PWA 虚拟模块:

```vue
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

const needRefresh = ref(false);

let updateServiceWorker: (() => Promise<void>) | undefined;

function onNeedRefresh() {
  needRefresh.value = true;
}
async function close() {
  needRefresh.value = false;
}

onBeforeMount(async () => {
  const { registerSW } = await import('virtual:pwa-register');
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  });
});
</script>
```

## 多项目和框架的 Monorepo

从版本 `0.14.5` 开始， `vite-plugin-pwa` 为每个框架提供了类型，因此您可以在单个代码库项目中导入适当的虚拟模块。不要通过 `vite-plugin-pwa/client`（tsconfig.json 文件或 TypeScript 引用）使用 [client.d.ts](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/client.d.ts)，而是使用以下任意一个虚拟模块

- `virtual:pwa-register/react`: 配置 `vite-plugin-pwa/react`.
- `virtual:pwa-register/preact`: 配置 `vite-plugin-pwa/preact`.
- `virtual:pwa-register/solid`: 配置 `vite-plugin-pwa/solid`.
- `virtual:pwa-register/svelte`: 配置 `vite-plugin-pwa/svelte`.
- `virtual:pwa-register/vanillajs`: 配置 `vite-plugin-pwa/vanillajs`.
- `virtual:pwa-register/vue`: 配置 `vite-plugin-pwa/vue`.

在 [vite-plugin-pwa repo](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples) 的示例文件夹中，您可以找到 `preact` 、 `solid` 和 `svelte` 的一些示例。

## 在开发环境中屏蔽 workbox-build 警告

如果您正在使用`vite-plugin-pwa` 的 `generateSW` 策略, 在开发环境中你可以使用`suppressWarnings`选项来屏蔽`workbox-build` 的警告:

```ts
devOptions: {
  suppressWarnings: true;
}
```

启用此选项， `vite-plugin-pwa` 开发插件将:

- 在 `dev-dist` 文件夹中生成一个空的 `suppress-warnings.js` 文件。
- 修改 `workbox.globPatterns` 选项为 [*.js']
