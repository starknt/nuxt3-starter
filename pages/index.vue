<template>
  <div class="flex flex-col gap-2 mt-12">
    <div class="flex gap-x-4">
      <n-button type="warning">
        {{ $t('button.confirm') }}
      </n-button>
      <n-button type="info">
        {{ $t('button.cancel') }}
      </n-button>
    </div>
    <NuxtWelcome />
  </div>
</template>
