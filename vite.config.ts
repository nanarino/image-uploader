import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@holy-two/vite-plugin-alias'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    alias()
  ]
})