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

## Testing your application on production

Once you deploy your application to your server, you can test it using [WebPageTest](https://www.webpagetest.org/).

There are many test sites, but we suggest you use `WebPageTest` as this is the most comprehensive in terms of test:

- Security.
- First byte time.
- Keep alive enabled.
- Compress transfer.
- Cache static content.
- Effective use of CDN.
- Lighthouse: Core Web Vitals, Performance, Images size optimization...
- And more...

Enter the url of your application, click `Start Test` button, wait for the test to finish, the `WebPageTest` result will hint you what things on your application must be fixed/changed. The `WebPageTest` result will also score your application, it will also test your site with `Lighthouse`.

For example, go to [WebPageTest](https://www.webpagetest.org/), enter `https://vite-pwa-org.netlify.app/`, click `Start Test` button, wait a few seconds for the test to finish, and see the results for this site.
