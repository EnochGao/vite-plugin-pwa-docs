---
title: Vite, Rollup, PWA and Workbox 说明书 | 指南
outline: deep
---

<script setup>
const images = Object.entries(
  import.meta.glob('/assets/*.svg', { query: '?raw', eager: true, import: 'default' })
).reduce((acc, [image, content]) => {
  const name = image.replace('/assets/', '')
  acc[name.replace('.svg', '')] = content
  return acc
}, {})
</script>

# Vite, Rollup, PWA and Workbox 说明书

在本页中，我们将解释`vite-plugin-pwa`如何构建 service worker。

你可以<a href="https://excalidraw.com/#json=TwI1I_rRXYcGFINLH-Yrw,JRavRIdQuT-uvqjTi6S3Qg">打开 Excalidraw 的源图</a>
以查看 SVG 图像。

## Vite config file

<div v-html="images['vite-config-file']"></div>

## Vite Build CLI

<div v-html="images['vite-build-cli']"></div>

## vite-plugin-pwa closeBundle hook

<div v-html="images['close-bundle-hook']"></div>

## workbox-build injectManifest

<div v-html="images['inject-manifest']"></div>
