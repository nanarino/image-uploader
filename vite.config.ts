import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import alias from "@holy-two/vite-plugin-alias"
import path from "node:path"
import { createSvgIconsPlugin as icons } from "vite-plugin-svg-icons"
import { insertHtml as insert, h } from "vite-plugin-insert-html"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    alias(),
    icons({ iconDirs: [path.resolve(process.cwd(), "src/icons")] }),
    insert({
      head: [
        h(
          "script",
          { type: "text/javascript" },
          readFileSync(
            fileURLToPath(
              import.meta.resolve("@holy-two/data-theme/dist/iife/index.js")
            ),
            "utf8"
          )
        ),
      ],
    }),
  ],
})
