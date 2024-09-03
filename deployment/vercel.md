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
3. **配置部署**:Vercel 会自动检测该项目是否为 Vite 项目，并提供默认配置建议。根据需要进行相应的调整. Adjust these settings as needed.
4. **部署**:确认配置后，单击**Deploy**开始部署过程

### 步骤 4: 验证部署

Once deployment is complete, Vercel will provide a URL to access your deployed application. Check that everything works as expected, especially that the HTTP headers are applied correctly by inspecting the server responses using your browser's developer tools.

### 清除 Vercel 管理中的数据缓存 <Badge text="可选" type="tip"/>

It might be useful to clear the data cache in Vercel's administration panel, especially if you are experiencing issues with stale content or deployment errors that seem unrelated to your current build. Clearing the cache ensures that all previous build settings, dependencies, and stored data are removed, allowing a fresh start for a new deployment. This can help in resolving unexpected behavior and improving the reliability of deployment processes.

Here is an explanation of the `vercel.json` configuration file, suitable for adding to your documentation:

## 理解 Vercel 部署的 `vercel.json`配置文件

The `vercel.json` file is a crucial component for configuring deployments on Vercel. It allows you to customize how Vercel serves your application, including how it handles HTTP headers, redirects, rewrites, caching, and more. This file should be placed in the root directory of your project.

[Vercel docs](https://vercel.com/docs/projects/project-configuration)

Below is a detailed explanation of each part of the `vercel.json` file provided in the setup instructions:

### HTTP Headers 配置

The `headers` section of the `vercel.json` file allows you to specify HTTP response headers that should be added to responses serving files from specified paths:

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
