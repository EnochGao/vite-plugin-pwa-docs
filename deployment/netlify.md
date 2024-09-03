---
title: Netlify | 部署
---

# Netlify

## 配置 `manifest.webmanifest` mime 类型

你需要注册正确的 web 清单的 MIME 类型，通过添加一个 headers 表到你的 `netlify.toml` 文件(见下面的基本部署):

```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

## Cache-Control

一般来说， `/assets/`中的文件会有很长的缓存时间，其中的所有内容都应该在文件名中包含一个哈希值

添加另一个 headers 表到你的 `netlify.toml` 文件(见下面的基本部署):

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```

## 配置 http 重定向到 https

Netlify 会自动重定向，所以你不用担心。

## 基本部署示例

添加 `netlify.toml` 文件到根目录，内容如下：

```toml
[build]
  publish = "dist"
  command = "pnpm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```
