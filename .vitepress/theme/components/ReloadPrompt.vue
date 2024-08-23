<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const needRefresh = ref(false)

let updateServiceWorker: (() => Promise<void>) | undefined

function onNeedRefresh() {
  needRefresh.value = true
}
async function close() {
  needRefresh.value = false
}

onBeforeMount(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  })
})
</script>

<template>
  <template v-if="needRefresh">
    <div
      class="pwa-toast z-100 bg-$vp-c-bg b b-solid b-1px b-color-$pwa-border fixed right-0 bottom-0 m-6 px-6 py-4 rounded-2 shadow-xl"
      role="alertdialog"
      aria-labelledby="pwa-message"
    >
      <div id="pwa-message" class="mb-3">
        有新内容可用，请单击重新加载按钮进行更新。
      </div>
      <button
        type="button"
        class="pwa-refresh mr-2 px-3 py-1 rounded"
        @click="updateServiceWorker?.()"
      >
        重新加载
      </button>
      <button
        type="button"
        class="pwa-cancel b b-solid b-1px !b-color-$pwa-border mr-2 px-3 py-1 rounded"
        @click="close"
      >
        关闭
      </button>
    </div>
  </template>
</template>
