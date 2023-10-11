<script setup lang="ts">
const { height } = useWindowSize()

onBeforeMount(() => {
  if (!messageApi.value)
    messageApi.value = useMessage()
  if (!notificationApi.value)
    notificationApi.value = useNotification()
})
</script>

<template>
  <main class="w-full flex items-center justify-center sm:h-screen sm:min-h-screen" :style="{ height: `${height}px` }">
    <slot />
  </main>
</template>
