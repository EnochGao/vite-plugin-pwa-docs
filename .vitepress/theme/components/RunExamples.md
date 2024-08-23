::: warning 警告

按照以下说明操作之前, 请先阅读 [贡献指南](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md).
:::

确保安装项目依赖项，并在clone/fork本地上构建存储库：

```shell
cd vite-plugin-pwa
pnpm install
pnpm run build
```

要运行示例，请从 shell（从根文件夹）执行以下脚本，它将启动一个 CLI，您将在其中选择框架和 pwa 选项：

```shell
pnpm run examples
```

如果你没有首先运行 `pnpm build` , 你看能会看到像这样的错误, `failed to load config` 或者 `Please verify that the package.json has a valid "main" entry`.
