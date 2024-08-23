如果你使用`SSR/SSG`, 你需要导入 `virtual:pwa-register` 模块使用动态导入并且检查 `window` 是否 `undefined`.

你可以在`src/pwa.ts` 模块注册 service worker:

```ts
import { registerSW } from 'virtual:pwa-register';

registerSW({
  /* ... */
});
```

and then import it from your `main.ts`:

```ts
if (typeof window !== 'undefined') import('./pwa');
```

更多信息请查看 [常见问题解答](/guide/faq#navigator-window-is-undefined)
