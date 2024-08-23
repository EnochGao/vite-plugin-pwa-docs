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

## 从HTTP重定向到HTTPS的基本配置

使用以下配置文件更新您的 `server.conf`:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}
```

## Cache-Control

Ensure you have a very restrictive setup for your `Cache-Control` headers in place.

Double check that **you do not** have caching features enabled, especially `immutable`, on locations like:

- `/`
- `/sw.js`
- `/index.html`
- `/manifest.webmanifest`

NGINX will add `E-Tag`-headers itself, so there is not much to in that regard.

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

An example configuration inside your `server` block could be:

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

Be aware that this is a very simplistic approach and you must test every change, as the NGINX match precedences for locations are not very intuitive and error prone if you do not know the [exact rules](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#location_priority).

::: danger
**Always re-test and re-assure** that the caching for mission critical files is **as low** as possible if not hashed files or you might invalidate clients for a long time.
:::
