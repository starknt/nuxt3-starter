import { createI18n } from 'vue-i18n'

import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'zh-CN',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  })

  vueApp.use(i18n)
})
