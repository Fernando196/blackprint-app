// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Esto le dice a ESLint que permita (y exija) el cierre /> en etiquetas como <img>
    // Así se pone de acuerdo con lo que hace Prettier automáticamente
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
