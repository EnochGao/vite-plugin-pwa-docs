::: warning 警告

**这只适用于在导入任何虚拟模块或使用 `workbox-window` 模块时**

因为 `workbox-window` 使用基于时间的 `heuristic` 算法来处理 service worker 更新，因此，如果您构建了自己的 service worker 并再次注册它，如果上次注册和本次注册之间的时间不足 1 分钟，那么`workbox-window` 将把 `service worker update found` 事件作为外部事件处理，因此可能会有很奇怪的行为（例如，如果使用 `prompt` ，将显示离线准备就绪的对话框，而不是显示新内容可用的对话框；如果使用 `autoUpdate` ，将显示离线准备就绪的对话框，然而它不应该显示）。
:::
