---
title: Vue | 框架
---

# Vue

## Vue 3

对于 `Vue 3`你可以使用`Vite`内置的虚拟模块 `virtual:pwa-register/vue` 它能返回 `composition api` 参照 (`ref<boolean>`) `offlineReady` 和 `needRefresh`.

### 类型声明

::: tip 提示
<TypeScriptError2307 />

从`0.14.5`版本开始，你还可以为 vue 使用类型定义，而不是`vite-plugin-pwa/client`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/vue"]
  }
}
```

或者你可以添加以下引用在任何的 `d.ts` 文件中（例如，在 `vite-env.d.ts` 或 `global.d.ts` 中）：

```ts
/// <reference types="vite-plugin-pwa/vue" />
```

:::

```ts
declare module 'virtual:pwa-register/vue' {
  import type { Ref } from 'vue';
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>;
    offlineReady: Ref<boolean>;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
```

### 更新提示

你可以使用 `ReloadPrompt.vue` 组件:

::: details ReloadPrompt.vue

```vue
<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

async function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">Reload</button>
    <button @click="close">Close</button>
  </div>
</template>

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

### 定期 SW 更新

正如[定期更新 Service Worker](/guide/periodic-sw-updates)解释，你可以在你的应用中使用虚拟模块`virtual:pwa-register/vue`来配置此行为:

```ts
import { useRegisterSW } from 'virtual:pwa-register/vue';

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

间隔必须以毫秒为单位，在上面的例子中，它被配置为每小时检查一次service worker。

<HeuristicWorkboxWindow />

## Vue 2

因为这个插件只支持`Vue 3`，所以你不能使用虚拟模块 `virtual:pwa-register/vue`。

你可以把`useRegisterSW.js` `mixin`拷贝到你的`@/mixins/`目录下，让它工作:

::: details useRegisterSW.js

```js
export default {
  name: 'useRegisterSW',
  data() {
    return {
      updateSW: undefined,
      offlineReady: false,
      needRefresh: false,
    };
  },
  async mounted() {
    try {
      const { registerSW } = await import('virtual:pwa-register');
      const vm = this;
      this.updateSW = registerSW({
        immediate: true,
        onOfflineReady() {
          vm.offlineReady = true;
          vm.onOfflineReadyFn();
        },
        onNeedRefresh() {
          vm.needRefresh = true;
          vm.onNeedRefreshFn();
        },
        onRegistered(swRegistration) {
          swRegistration && vm.handleSWManualUpdates(swRegistration);
        },
        onRegisterError(e) {
          vm.handleSWRegisterError(e);
        },
      });
    } catch {
      console.log('PWA disabled.');
    }
  },
  methods: {
    async closePromptUpdateSW() {
      this.offlineReady = false;
      this.needRefresh = false;
    },
    onOfflineReadyFn() {
      console.log('onOfflineReady');
    },
    onNeedRefreshFn() {
      console.log('onNeedRefresh');
    },
    updateServiceWorker() {
      this.updateSW && this.updateSW(true);
    },
    handleSWManualUpdates(swRegistration) {},
    handleSWRegisterError(error) {},
  },
};
```

:::

### 更新提示

你可以使用 `ReloadPrompt.vue` 组件:

::: details ReloadPrompt.vue

```vue
<script>
import useRegisterSW from '@/mixins/useRegisterSW';

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW],
};
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">Reload</button>
    <button @click="close">Close</button>
  </div>
</template>

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

### 定期 SW 更新

正如 [定期更新 Service Worker](/guide/periodic-sw-updates)中解释，你可以在你的应用中使用`useRegisterSW.js` `mixin`用这段代码来配置此行为:

```vue
<script>
import useRegisterSW from '@/mixins/useRegisterSW';

const intervalMS = 60 * 60 * 1000;

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW],
  methods: {
    handleSWManualUpdates(r) {
      r &&
        setInterval(() => {
          r.update();
        }, intervalMS);
    },
  },
};
</script>
```

间隔必须以毫秒为单位，在上面的例子中，它被配置为每小时检查一次 service worker。

<HeuristicWorkboxWindow />
