import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { version } from '../package.json'
import { transformHead } from './scripts/transformHead'
import { pwa } from './scripts/pwa'

const Guide: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/guide/',
  },
  {
    text: '注册 Service Worker',
    link: '/guide/register-service-worker',
  },
  {
    text: 'Service Worker 简介',
    link: '/guide/service-worker-precache',
  },
  {
    text: 'PWA最低要求',
    link: '/guide/pwa-minimal-requirements',
  },
  {
    text: 'Service Worker 策略和行为',
    link: '/guide/service-worker-strategies-and-behaviors',
  },
  {
    text: '自动重新加载',
    link: '/guide/auto-update',
  },
  {
    text: '更新提示',
    link: '/guide/prompt-for-update',
  },
  {
    text: '高级 (injectManifest)',
    link: '/guide/inject-manifest',
  },
  {
    text: '静态资产处理',
    link: '/guide/static-assets',
  },
  {
    text: '定期更新 Service Worker',
    link: '/guide/periodic-sw-updates',
  },
  {
    text: '开发',
    link: '/guide/development',
  },
  {
    text: '搭建您的第一个Vite PWA项目<sup class="VPBadgeCustom tip">新</sup>',
    link: '/guide/scaffolding',
  },
  {
    text: '没有PWA功能的Service Worker',
    link: '/guide/service-worker-without-pwa-capabilities',
  },
  {
    text: '注销 Service Worker',
    link: '/guide/unregister-service-worker',
  },
  {
    text: '测试 Service Worker',
    link: '/guide/testing-service-worker',
  },
  {
    text: 'Vite, Rollup, PWA and Workbox 说明书',
    link: '/guide/cookbook',
  },
  {
    text: '更新日志',
    link: '/guide/change-log',
  },
  {
    text: '常见问题解答',
    link: '/guide/faq',
  },
]

const Deployment: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/deployment/',
  },
  {
    text: 'Netlify',
    link: '/deployment/netlify',
  },
  {
    text: 'AWS Amplify',
    link: '/deployment/aws',
  },
  {
    text: 'Vercel',
    link: '/deployment/vercel',
  },
  {
    text: 'NGINX',
    link: '/deployment/nginx',
  },
  {
    text: 'Apache Http Server 2.4+',
    link: '/deployment/apache',
  },
]

const AssetsGenerator: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/assets-generator/',
  },
  {
    text: 'CLI',
    link: '/assets-generator/cli',
  },
  {
    text: 'API',
    link: '/assets-generator/api',
  },
  {
    text: '集成 <sup class="VPBadgeCustom tip">实验性</sup>',
    link: '/assets-generator/integrations',
  },
  {
    text: '迁移',
    link: '/assets-generator/migrations',
  },
]

const Frameworks: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/frameworks/',
  },
  {
    text: 'Vue',
    link: '/frameworks/vue',
  },
  {
    text: 'React',
    link: '/frameworks/react',
  },
  {
    text: 'Svelte',
    link: '/frameworks/svelte',
  },
  {
    text: 'SolidJS',
    link: '/frameworks/solidjs',
  },
  {
    text: 'Preact',
    link: '/frameworks/preact',
  },
  {
    text: 'îles',
    link: '/frameworks/iles',
  },
  {
    text: 'SvelteKit',
    link: '/frameworks/sveltekit',
  },
  {
    text: 'VitePress',
    link: '/frameworks/vitepress',
  },
  {
    text: 'Astro',
    link: '/frameworks/astro',
  },
  {
    text: 'Nuxt 3',
    link: '/frameworks/nuxt',
  },
  {
    text: 'Qwik',
    link: '/frameworks/qwik',
  },
  {
    text: 'Remix',
    link: '/frameworks/remix',
  },
]

const Examples: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/examples/',
  },
  {
    text: 'Vue',
    link: '/examples/vue',
  },
  {
    text: 'React',
    link: '/examples/react',
  },
  {
    text: 'Svelte',
    link: '/examples/svelte',
  },
  {
    text: 'SolidJS',
    link: '/examples/solidjs',
  },
  {
    text: 'Preact',
    link: '/examples/preact',
  },
  {
    text: 'îles',
    link: '/examples/iles',
  },
  {
    text: 'SvelteKit',
    link: '/examples/sveltekit',
  },
  {
    text: 'VitePress',
    link: '/examples/vitepress',
  },
  {
    text: 'Astro',
    link: '/examples/astro',
  },
  {
    text: 'Nuxt 3',
    link: '/examples/nuxt',
  },
  {
    text: 'Qwik',
    link: '/examples/qwik',
  },
  {
    text: 'Remix',
    link: '/examples/remix',
  },
]

const Workbox: DefaultTheme.SidebarItem[] = [
  {
    text: '开始',
    link: '/workbox/',
  },
  {
    text: 'generateSW',
    link: '/workbox/generate-sw',
  },
  {
    text: 'injectManifest',
    link: '/workbox/inject-manifest',
  },
]

function prepareSidebar(idx: number) {
  return [
    {
      text: '指南',
      collapsible: true,
      collapsed: true,
      items: Guide,
    },
    {
      text: 'PWA 资产生成器',
      collapsible: true,
      collapsed: true,
      items: AssetsGenerator,
    },
    {
      text: '框架',
      collapsible: true,
      collapsed: true,
      items: Frameworks,
    },
    {
      text: '示例',
      collapsible: true,
      collapsed: true,
      items: Examples,
    },
    {
      text: '部署',
      collapsible: true,
      collapsed: true,
      items: Deployment,
    },
    {
      text: 'Workbox',
      collapsible: true,
      collapsed: true,
      items: Workbox,
    },
  ].map<DefaultTheme.SidebarItem>((entry, i) => {
    if (idx === i)
      entry.collapsed = false

    return entry
  })
}

const ogUrl = 'https://vite-pwa-org.netlify.app/'
const ogImage = `${ogUrl}og-image.png`

export default withPwa(defineConfig({
  lang: 'zh-Hans',
  title: 'Vite PWA',
  description: 'Zero-config PWA Framework-agnostic for Vite and Integrations',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', href: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', {
      name: 'keywords',
      content: 'PWA, React, Vue, VitePress, Preact, Svelte, SvelteKit, workbox, SolidJS, Vite, vite-plugin, íles, Astro, Nuxt 3, Nuxt module, Remix',
    }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite and Integrations' }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { name: 'twitter:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite and Integrations' }],
    ['meta', { name: 'twitter:title', content: 'Vite PWA' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:site', content: '@antfu7' }],
    ['meta', { name: 'twitter:url', content: ogUrl }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  srcExclude: ['README.md', 'CONTRIBUTING.md'],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  locales: {
    root: { label: '中文简体' },
    en: { label: 'English', link: 'https://vite-pwa-org.netlify.app' },
  },
  themeConfig: {
    // logo: '/favicon.svg',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    editLink: {
      pattern: 'https://github.com/EnochGao/vite-plugin-pwa-zh-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页面',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '输入',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'esc',
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/uccDuWkScq' },
      { icon: 'github', link: 'https://github.com/vite-pwa/vite-plugin-pwa' },
    ],
    footer: {
      message: '在MIT许可下发布.',
      copyright: 'Copyright © 2021-PRESENT Anthony Fu',
    },
    nav: [
      {
        text: '指南',
        items: [
          {
            text: '开始',
            link: '/guide/',
            activeMatch: '^/guide/',
          },
          {
            text: 'PWA 资产生成器',
            link: '/assets-generator/',
            activeMatch: '^/assets-generator/',
          },
          {
            text: '框架',
            link: '/frameworks/',
            activeMatch: '^/frameworks/',
          },
          {
            text: '示例',
            link: '/examples/',
            activeMatch: '^/examples/',
          },
        ],
        activeMatch: '^/(guide|assets-generator|frameworks|examples)/',
      },
      {
        text: '部署',
        link: '/deployment/',
        activeMatch: '^/deployment/',
      },
      {
        text: 'Workbox',
        link: '/workbox/',
        activeMatch: '^/workbox/',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Vite Plugin PWA',
            items: [
              {
                text: '更新日志',
                link: 'https://github.com/vite-pwa/vite-plugin-pwa/releases',
              },
              {
                text: '参与贡献',
                link: 'https://github.com/vite-pwa/vite-plugin-pwa/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            text: 'îles Module',
            items: [
              {
                text: 'Github',
                link: 'https://github.com/ElMassimo/iles/tree/main/packages/pwa',
              },
              {
                text: '文档',
                link: 'https://iles-docs.netlify.app/guide/pwa',
              },
            ],
          },
          {
            text: '集成',
            items: [
              {
                text: 'SvelteKit',
                link: 'https://github.com/vite-pwa/sveltekit',
              },
              {
                text: 'VitePress',
                link: 'https://github.com/vite-pwa/vitepress',
              },
              {
                text: 'Astro',
                link: 'https://github.com/vite-pwa/astro',
              },
              {
                text: 'Nuxt 3',
                link: 'https://github.com/vite-pwa/nuxt',
              },
              {
                text: 'Qwik',
                link: 'https://github.com/QwikDev/pwa',
              },
              {
                text: 'Remix',
                link: 'https://github.com/vite-pwa/remix',
              },
            ],
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': prepareSidebar(0),
      '/assets-generator/': prepareSidebar(1),
      '/frameworks/': prepareSidebar(2),
      '/examples/': prepareSidebar(3),
      '/deployment/': prepareSidebar(4),
      '/workbox/': prepareSidebar(5),
    },
  },
  vite: {
    logLevel: 'info',
  },
  pwa,
  transformHead,
}))
