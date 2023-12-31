import antfu from '@antfu/eslint-config'

export default antfu({
  overrides: [
    {
      files: ['locales/**.json'],
      rules: {
        'jsonc/sort-keys': 'error',
      },
    },
  ],
  rules: {
    'vue/no-restricted-syntax': ['error', {
      selector: 'VElement[name=\'a\']',
      message: 'Use NuxtLink instead.',
    }],
    'no-console': ['error', { allow: ['warn', 'debug', 'error'] }],
    'n/prefer-global/process': 'off',
  },
  ignores: [
    '*.{png,svg,ico,webp,woff2}',
    'Dockerfile',
    'public',
    'bun.lockb',
  ],
})
