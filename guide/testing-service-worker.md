---
title: 测试 Service Worker | 指南
---

# 测试 Service Worker

有相当多的测试库， `vite-plugin-pwa` 使用 [Vitest](https://vitest.dev/) 进行构建测试，以及使用[Playwright](https://playwright.dev/)进行浏览器内测试(仅针对 Chromium 浏览器)。

你可以在对应仓库的 `examples` 文件夹中查看框架示例:

- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples)
- [@vite-pwa/nuxt](https://github.com/vite-pwa/nuxt) (在根目录)
- [@vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit/tree/main/examples)

以及相应的贡献指南:

- [running tests in vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/CONTRIBUTING.md#running-tests)
- [running tests in @vite-pwa/nuxt](https://github.com/vite-pwa/nuxt/blob/main/CONTRIBUTING.md#running-tests)
- [running tests in @vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit/blob/main/CONTRIBUTING.md#running-tests)

`vite-plugin-pwa` 和 `@vite-pwa/nuxt` 已分别添加到 [Vite ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 和 [Nuxt ecosystem-ci](https://github.com/nuxt/ecosystem-ci) 中，以检测新 Vite/Nuxt 版本中可能出现的回归问题：

- [Discord Vite ecosystem-ci](https://discord.com/channels/804011606160703521/928398470086291456)
- [Discord Nuxt ecosystem-ci](https://discord.com/channels/473401852243869706/1098558476483055656)

我们也在努力将`@vite-pwa/sveltekit` 纳入[Svelte ecosystem-ci](https://github.com/sveltejs/svelte-ecosystem-ci)。

## 测试构建

检查根目录下的 `vitest.config.mts` 和每个示例中的 `test` 文件夹

在每个 `package.json` 文件示例中，您都有一个 `test` 脚本来运行构建和浏览器内测试。

## 浏览器测试

检查根目录下的 `playwright.config.ts` 和每个示例中的 `client-test` 文件夹。

在每个 `package.json` 文件示例中，您都有一个 `test` 脚本来运行构建和浏览器内测试。

在这种情况下，我们还需要启动一个服务器来运行测试，检查 `playwright.config.ts` 中的 `webServer`
