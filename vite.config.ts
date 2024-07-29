import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import alias from "@holy-two/vite-plugin-alias"
import path from "node:path"
import { createSvgIconsPlugin as icons } from "vite-plugin-svg-icons"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    alias(),
    icons({ iconDirs: [path.resolve(process.cwd(), "src/icons")] }),
  ],
})
