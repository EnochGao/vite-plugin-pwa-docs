---
title: Svelte | 框架
---

# Svelte

You can use the built-in `Vite` virtual module `virtual:pwa-register/svelte` for `Svelte` which will return `writable` stores (`Writable<boolean>`) for `offlineReady` and `needRefresh`.

::: warning 警告
你需要将 `workbox-window` 作为 `dev` 依赖添加到你的 `Vite` 项目中
:::

## 类型声明

::: tip 提示
<TypeScriptError2307 />
From version `0.14.5` you can also use types definition for svelte instead of `vite-plugin-pwa/client`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/svelte"]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/svelte" />
```

:::

```ts
declare module 'virtual:pwa-register/svelte' {
  import type { Writable } from 'svelte/store';
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable<boolean>;
    offlineReady: Writable<boolean>;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
```

## Prompt for update

You can use this `ReloadPrompt.svelte` component:

::: details ReloadPrompt.svelte

```html
<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });

  function close() {
    offlineReady.set(false)
    needRefresh.set(false)
  }

  $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
  <div
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      {#if $offlineReady}
      <span>
        App ready to work offline
      </span>
      {:else}
      <span>
        New content available, click on reload button to update.
      </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button on:click={() => updateServiceWorker(true)}>
        Reload
      </button>
    {/if}
    <button on:click={close}>
      Close
    </button>
  </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border: 1px solid #8885;
        border-radius: 4px;
        z-index: 1;
        text-align: left;
        box-shadow: 3px 4px 5px 0 #8885;
        background-color: white;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
    .pwa-toast button {
        border: 1px solid #8885;
        outline: none;
        margin-right: 5px;
        border-radius: 2px;
        padding: 3px 10px;
    }
</style>
```

:::

## Periodic SW Updates

As explained in [定期更新 Service Worker ](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/svelte`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/svelte';

const intervalMS = 60 * 60 * 1000;

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
});
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

<HeuristicWorkboxWindow />
