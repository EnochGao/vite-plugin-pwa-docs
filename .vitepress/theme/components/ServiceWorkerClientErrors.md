查看[新的 Vite 构建](/guide/change-log#new-vite-build)部分获取更多详细信息，以下描述的错误已在 `v0.18.0+` 中修复，并且不需要使用 `iife` 格式来构建您的 service worker。

如果您的 service worker 代码使用意外的 `exports` 编译(例如: `export default require_sw();` )，您可以将构建输出格式更改为 `iife` ，将以下代码添加到您的 pwa 配置:

```ts
injectManifest: {
  rollupFormat: 'iife';
}
```
