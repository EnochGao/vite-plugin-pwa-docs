---
title: NGINX | 开发
---

# NGINX

## 配置 `manifest.webmanifest` mime 类型

你需要为 web manifest 注册正确的 MIME 类型，将其添加到`/etc/nginx/mime.types`的[默认](https://www.nginx.com/resources/wiki/start/topics/examples/full/#mime-types)文件中

```nginx
# /etc/nginx/mime.types
types {
  # Manifest files
  application/manifest+json  webmanifest;
  ...
}
```

或者任何带有 `http`, `server` 或 `location` 位置的块

```nginx
include mime.types;
types {
  application/manifest+json  webmanifest;
}
```

应用程序部署后，可以通过检查 HTTP 头来验证设置是否正确。

```shell script
curl -s -I -X GET https://yourserver/manifest.webmanifest | grep content-type -i
```

检查结果是否为 `content-type: application/manifest+json`.

## 从 HTTP 重定向到 HTTPS 的基本配置

使用以下配置文件更新您的 `server.conf`:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}
```

## Cache-Control

确保你对 `Cache-Control` 标头有一个非常严格的设置

仔细检查你**没有**启用缓存功能，特别是 `immutable` ，在如下位置:

- `/`
- `/sw.js`
- `/index.html`
- `/manifest.webmanifest`

NGINX 会自己添加 `E-Tag`-headers，所以在这方面没有太多的问题。

一般情况下，`/assets/` 中的文件可以具有很长的缓存时间，因为其中的所有内容都应该在文件名中包含哈希值。

在你的`server`块中，可以像这样配置：

```nginx
# all assets contain hash in filename, cache forever
location ^~ /assets/ {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# all workbox scripts are compiled with hash in filename, cache forever
location ^~ /workbox- {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# assume that everything else is handled by the application router, by injecting the index.html.
location / {
    autoindex off;
    expires off;
    add_header Cache-Control "public, max-age=0, s-maxage=0, must-revalidate" always;
    ...
    try_files $uri /index.html =404;
}
```

请注意，这是一种非常简单的方法，如果你不知道确切的[规则](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#location_priority)，你必须测试每一个更改，NGINX 的位置匹配优先级不是很直观，而且容易出错。

::: danger 危险

如果没有进行文件哈希，一定要**重新测试**和**确保**关键任务文件的缓存**尽可能低**，否则可能会使客户端长时间失效。
:::
