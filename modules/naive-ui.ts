import { addComponent, addImports, defineNuxtModule, extendViteConfig } from '@nuxt/kit'
import naive from 'naive-ui'

export default defineNuxtModule({
  meta: {
    name: 'naive-ui',
  },
  hooks: {
    'prepare:types': ({ references }) => {
      references.push({
        types: 'naive-ui/volar',
      })
    },
  },
  setup(_options, nuxt) {
    const naiveComponents = Object.keys(naive).filter(name =>
      /^(N[A-Z]|n-[a-z])/.test(name),
    )

    naiveComponents.forEach((name) => {
      addComponent({
        export: name,
        name,
        filePath: 'naive-ui',
      })
    })

    // Add imports for naive-ui composables
    const naiveComposables = [
      'useDialog',
      'useMessage',
      'useNotification',
      'useLoadingBar',
      'useThemeVars',
    ]

    naiveComposables.forEach((name) => {
      addImports({
        name,
        as: name,
        from: 'naive-ui',
      })
    })

    if (nuxt.options.dev) {
      nuxt.options.build.transpile.push('@juggle/resize-observer')
      extendViteConfig((config) => {
        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.include = config.optimizeDeps.include || []
        config.optimizeDeps.include.push(
          'naive-ui',
          'vueuc',
          'date-fns-tz/formatInTimeZone',
        )
      })
    }
    else {
      nuxt.options.build.transpile.push(
        'naive-ui',
        'vueuc',
        '@css-render/vue3-ssr',
        '@juggle/resize-observer',
      )
    }
  },
})
