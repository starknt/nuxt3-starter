import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import type { WritableComputedRef } from 'nuxt/dist/app/compat/capi'

export interface ThemeSwitcherContext {
  preference: WritableComputedRef<'light' | 'dark' | 'system'>
  theme: ComputedRef<BuiltInGlobalTheme>
}
