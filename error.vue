<script setup lang="ts">
import type { NuxtError } from '#app'

// prevent reactive update when clearing error
const { error } = defineProps<{
  error: Partial<NuxtError>
}>()

// add more custom status codes messages here
const errorCodes: Record<number, string> = {
  404: 'Page not found',
}

if (process.dev)
  console.error(error)

const defaultMessage = 'Something went wrong'

const message = error.message ?? errorCodes[error.statusCode!] ?? defaultMessage

const state = ref<'error' | 'reloading'>('error')
async function reload() {
  state.value = 'reloading'
  try {
    clearError({ redirect: '/' })
  }
  catch (err) {
    console.error(err)
    state.value = 'error'
  }
}
</script>

<template>
  <ThemeSwitcherProvider v-slot="{ theme }">
    <NConfigProvider :theme="theme.value">
      <NGlobalStyle />
      <NMessageProvider>
        <NNotificationProvider>
          <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />

          <NuxtLayout>
            <span timeline-title-style>Error</span>
            <form grid gap-y-4 p5 @submit="reload">
              <div text-lg>
                发生了一些错误
              </div>
              <div text-secondary>
                {{ message }}
              </div>
              <button btn-solid flex items-center justify-center gap-2 text-center :disabled="state === 'reloading'">
                <span v-if="state === 'reloading'" block preserve-3d animate-spin>
                  <span i-ri:loader-2-fill block />
                </span>
                {{ state === 'reloading' ? '重新加载中...' : '重新加载' }}
              </button>
            </form>
          </NuxtLayout>
        </NNotificationProvider>
      </NMessageProvider>
    </NConfigProvider>
  </ThemeSwitcherProvider>
</template>
