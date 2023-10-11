<template>
  <theme-switcher-provider v-slot="{ theme }">
    <n-config-provider :theme="theme.value">
      <n-globalStyle />
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <NuxtLayout>
              <NuxtPage :page-key="route => route.fullPath" />
            </NuxtLayout>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </theme-switcher-provider>
</template>
