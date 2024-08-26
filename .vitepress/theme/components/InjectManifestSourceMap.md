::: info 信息

从 `v0.18.0+`开始，你可以在 `injectManifest` 配置选项中使用 `minify`、`sourcemap` 和`enableWorkboxModulesLogs`，查看 [New Vite Build](/guide/change-log#new-vite-build) 部分了解更多详情。
:::

由于您正在构建自己的 service worker，这个插件将使用 Vite 的 `build.sourcemap` 配置选项默，认值为 `false` 来生成源映射

如果您想为 service worker 生成源映射，则需要为整个应用程序生成源映射
