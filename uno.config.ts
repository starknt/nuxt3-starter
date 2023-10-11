import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWind, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'block',
        'vertical-align': 'middle',
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      'hv-bg': 'bg-gray-200 dark:bg-dark/50',
      'fcc': 'flex justify-center items-center',
    },
  ],
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
        * {
          box-sizing: border-box;
        }

        body,
        html {
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: "HarmonyOS Sans","Segoe UI","SF Pro Display",-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -webkit-tap-highlight-color: transparent;
        }

        input[type=number], input[type=password], input[type=text], textarea {
          -webkit-appearance: none;
        }

        /* Color Mode transition */
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) {
          z-index: 1;
        }
        ::view-transition-new(root) {
          z-index: 2147483646;
        }
        .dark::view-transition-old(root) {
          z-index: 2147483646;
        }
        .dark::view-transition-new(root) {
          z-index: 1;
        }
      `,
    },
  ],
})
