::: tip 兼容性注意

Vite需要 [Node.js](https://nodejs.org/en/) 版本18.x.x或20+。然而，某些模板可能需要更高的Node.js版本才能正常工作，如果您的包管理器发出了此类警告，请升级Node.js
:::

::: code-group

```bash [pnpm]
$ pnpm create @vite-pwa/pwa
```

```bash [yarn]
$ yarn create @vite-pwa/pwa
```

```bash [npm]
$ npm create @vite-pwa/pwa@latest
```

```bash [bun]
$ bun create @vite-pwa/pwa
```
:::

然后按照提示操作

你也可以通过额外的命令行选项直接指定项目名称和要使用的模板。例如，要创建一个基于Vite的PWA Vue项目，请运行：

::: code-group

```bash [pnpm]
$ pnpm create @vite-pwa/pwa my-vue-app --template vue
```

```bash [yarn]
$ yarn create @vite-pwa/pwa my-vue-app --template vue
```

```bash [npm]
$ npm create @vite-pwa/pwa@latest my-vue-app -- --template vue
```

```bash [bun]
$ bun create @vite-pwa/pwa my-vue-app --template vue
```

:::

有关受支持的模板: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts` (模板可在 `templates` 文件夹中找到)更多详细信息，请参阅 [create-pwa](https://github.com/vite-pwa/create-pwa)
