<template>
  <div>
    <div class="mt-12 flex gap-x-4">
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
