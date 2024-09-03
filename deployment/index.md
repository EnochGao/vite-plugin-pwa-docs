---
title: 开始 | 部署
prev: Remix | 示例
---

# 开始

由于您需要将应用程序作为[渐进式 Web 应用程序](https://web.dev/explore/progressive-web-apps)安装，因此必须配置服务器以满足 [PWA 最低要求](/guide/pwa-minimal-requirements)，也就是说，您的服务器**必须**：

- 服务器 `manifest.webmanifest` 带有 `application/manifest+json` mime 类型
- 你必须通过 `https` 提供你的应用程序
- 必须从 `http` 重定向到 `https`

## Cache-Control

确保你对 `Cache-Control` 标头有一个非常严格的设置。

仔细检查你**没有**启用缓存功能，特别是 `immutable` ，在如下位置:

- `/`
- `/sw.js`
- `/index.html`
- `/manifest.webmanifest`

::: danger 危险

如果没有进行文件哈希，一定要重新测试和确保关键任务文件的缓存尽可能低，否则可能会使客户端长时间失效。
:::

## Servers

- [Netlify](/deployment/netlify)
- [AWS Amplify](/deployment/aws)
- [Vercel](/deployment/vercel)
- [NGINX](/deployment/nginx)
- [Apache Http Server 2.4+](/deployment/apache)

## 在生产环境中测试应用程序

一旦将应用程序部署到服务器上，就可以使用[WebPageTest](https://www.webpagetest.org/) 对其进行测试

有很多测试站点，但我们建议您使用`WebPageTest`作为测试站点，因为它具有最全面的测试：

- 安全.
- 第一字节时间.
- 保持激活状态.
- 压缩传输.
- 缓存静态内容.
- 有效使用 CDN.
- Lighthouse: 核心 Web 指标、性能、图片尺寸优化...
- 更多...

输入您的应用程序的链接，单击 `Start Test` 按钮，等待测试完成， `WebPageTest` 结果将提示您应用程序中必须修复/更改的内容。 `WebPageTest` 结果也将对您的应用程序进行评分，它还将以 `Lighthouse` 测试您的网站

例如，进入 [WebPageTest](https://www.webpagetest.org/)，输入 `https://vite-pwa-org.netlify.app/` ，点击` Start Test` 按钮，等待几秒钟测试完成，然后查看此站点的结果
