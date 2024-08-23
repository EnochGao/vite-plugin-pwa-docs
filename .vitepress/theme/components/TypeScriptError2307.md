如果你的 **TypeScript** 构建时或 **IDE** 抱怨在导入时找不到模块或类型定义，请将以下内容添加到`tsconfig.json`的 `compilerOptions.types` 数组中：

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/client"]
  }
}
```

或者你可以添加以下引用到任何 `d.ts` 文件中（例如，在 `vite-env.d.ts` 或 `global.d.ts` 中）：

```ts
/// <reference types="vite-plugin-pwa/client" />
```
