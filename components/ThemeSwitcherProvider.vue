<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'
import { InjectionThemeSwitcherContext } from '~/contants'
import type { ThemeSwitcherContext } from '~/types'

const colorMode = useColorMode()

const theme = computed(() => {
  return colorMode.value === 'dark' ? darkTheme : lightTheme
})

const preference = computed<'dark' | 'light' | 'system'>({
  set(v: 'dark' | 'light' | 'system') {
    colorMode.preference = v
  },
  get() {
    return colorMode.preference as 'dark' | 'light'
  },
})

const context: ThemeSwitcherContext = {
  preference,
  theme,
}

provide<ThemeSwitcherContext>(InjectionThemeSwitcherContext, context)
</script>

<template>
  <div>
    <slot v-bind="context" />
  </div>
</template>
