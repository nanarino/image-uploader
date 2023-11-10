import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@astropub/config-to-alias/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    alias()
  ]
})