---
title: Vercel | 部署
outline: deep
---

# Vercel

## 使用说明

本指南提供了在 Vercel 上部署 Vite PWA 的详细步骤，包括使用 `vercel.json` 文件进行 HTTP 头配置的具体设置

### 步骤 1: 准备你的 Vite PWA

确保您的应用程序已准备就绪可以部署.这包括在你的`package.json`中列出所有必要的依赖项，并确保应用程序能够在无错误的情况下编译

### 步骤 2: 创建 `vercel.json` 文件

在项目的根目录下创建一个名为`vercel.json`的文件，用于管理 HTTP 头和重定向。该配置文件模仿了 Netlify 的一些设置，但已针对 Vercel 平台进行了适配。

```json
{
  "headers": [
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 步骤 3: 在 Vercel 上设置你的项目

1. **登录进 Vercel**: 创建一个账户或登录 [Vercel](https://vercel.com).
2. **部署您的项目**: 点击 **New Project**, 然后选择您的 Vite PWA 所在的 Git 存储库.
3. **配置部署**:Vercel 会自动检测该项目是否为 Vite 项目，并提供默认配置建议。根据需要进行相应的调整.
4. **部署**:确认配置后，单击**Deploy**开始部署过程

### 步骤 4: 验证部署

一旦部署完成，Vercel 将提供一个 URL 来访问已部署的应用程序。通过使用浏览器的开发人员工具检查服务器响应，检查一切是否按预期工作，特别是 HTTP 头是否正确应用。

### 清除 Vercel 管理中的数据缓存 <Badge text="可选" type="tip"/>

清除 Vercel 管理面板中的数据缓存可能很有用，特别是如果您遇到陈旧内容的问题或与当前构建无关的部署错误。清除缓存可确保删除所有以前的构建设置、依赖项和存储的数据，从而允许重新开始新的部署。这有助于解决意外行为并提高部署流程的可靠性

下面是对 `vercel.json` 配置文件的解释，适合添加到您的文档中:

## 理解 Vercel 部署的 `vercel.json`配置文件

`vercel.json` 文件是在 Vercel 上配置部署的关键组件。它允许您自定义 Vercel 如何为您的应用程序服务，包括如何处理 HTTP 头，重定向，重写，缓存等。该文件应该放在项目的根目录中。

[Vercel 文档](https://vercel.com/docs/projects/project-configuration)

下面是对`vercel.json` 每个部分的详细说明：

### HTTP Headers 配置

`vercel.json` 文件的 `headers` 部分允许你指定 HTTP 响应头，这些头应该被添加到从指定路径服务文件的响应中:

- **HTML 文件**:

  ```json
  {
    "source": "/(.*).html",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=0, must-revalidate"
      }
    ]
  }
  ```

  该规则将 `Cache-Control` 头应用于所有 HTML 文件，表明它们不应该被缓存( `max-age=0` )，并且在每个请求上必须与服务器重新验证

- **Service Worker**:

  ```json
  {
    "source": "/sw.js",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=0, must-revalidate"
      }
    ]
  }
  ```

  与 HTML 文件类似，service worker 被设置为没有缓存，并且必须经常检查更新以确保它是最新的

- **Web Manifest**:

  ```json
  {
    "source": "/manifest.webmanifest",
    "headers": [
      {
        "key": "Content-Type",
        "value": "application/manifest+json"
      }
    ]
  }
  ```

  确保清单文件具有正确的 `Content-Type` 头，以便浏览器正确识别

- **Assets**:

  ```json
  {
    "source": "/assets/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "max-age=31536000, immutable"
      }
    ]
  }
  ```

  积极缓存图片、脚本和样式表等资源，使用较长的 `max-age` 来缩短回访者的加载时间

- **Security Headers**:

  ```json
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-XSS-Protection",
        "value": "1; mode=block"
      }
    ]
  }
  ```

  这些 headers 通过防止嗅探攻击、从另一个站点构建您的网站以及激活浏览器机制来阻止反射型 XSS 攻击来增强安全性。

### 重定向和重写

- **重写**:

  ```json
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
  ```

  此重写规则对于单页应用程序(SPAs)至关重要。它将指向任何路径的任何请求定向回 `index.html`，允许 SPA 中的前端路由处理该路径。
