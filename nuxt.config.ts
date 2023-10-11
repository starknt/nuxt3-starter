import { createResolver } from '@nuxt/kit'
import i18n from '@intlify/unplugin-vue-i18n/vite'
import { isCI, isDevelopment, isWindows } from 'std-env'
import { isPreview } from './config/env'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    ...(isDevelopment || isWindows) ? [] : ['nuxt-security'],
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  experimental: {
    // viewTransition: true,
    componentIslands: true,
  },

  app: {
    pageTransition: false,
    layoutTransition: false,
    keepalive: true,
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  css: [],

  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            /vue-i18n/,
          ]
        : [/vue-i18n/],
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock': ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
      'process.test': 'false',
    },
    build: {
      target: 'esnext',
    },
    plugins: [
      i18n({
        include: [
          resolve('./locales/*.json'),
        ],
      }),
    ],
    resolve: {
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
    },
    publicAssets: [
      {
        dir: '~/public/fonts',
        maxAge: 24 * 60 * 60 * 365, // 1 year (versioned)
        baseURL: '/fonts',
      },
    ],
    devProxy: {
      // '/api': {
      //   target: 'http://localhost:5174/api', // 这里是接口地址
      //   changeOrigin: true,
      //   prependPath: true,
      //   autoRewrite: true,
      // },
    },
    // 该配置用于服务端请求转发
    routeRules: {
      // '/api/**': {
      //   proxy: 'http://localhost:5174/api/**',
      // },

      // '/__nuxt_island/**': {
      //   security: {
      //     requestSizeLimiter: {
      //       maxRequestSizeInBytes: 1024 * 1024 * 1.5, // 1.5MB
      //     },
      //     xssValidator: false,
      //   },
      // },
    },
  },

  colorMode: {
    classSuffix: '',
  },

  sourcemap: isDevelopment,

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
      // contentSecurityPolicy: {
      //   'default-src': ['\'self\''],
      //   'base-uri': ['\'self\''],
      //   'connect-src': ['\'self\'', 'https:', 'http:', 'wss:', 'ws:'],
      //   'font-src': ['\'self\''],
      //   // 'form-action': ['\'none\''],
      //   'frame-ancestors': ['\'none\''],
      //   'img-src': ['\'self\'', 'https:', 'http:', 'data:', 'blob:'],
      //   'media-src': ['\'self\'', 'https:', 'http:'],
      //   'object-src': ['\'none\''],
      //   // 'script-src': ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\''],
      //   // 'script-src-attr': ['\'none\''],
      //   'style-src': ['\'self\'', '\'unsafe-inline\''],
      //   'upgrade-insecure-requests': true,
      // },
      // permissionsPolicy: {
      //   fullscreen: ['\'self\'', 'https:', 'http:'],
      // },
    },
    rateLimiter: false,
  },

  devtools: { enabled: true },
})

declare module '#app' {
  interface NuxtApp {
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
  }
}
