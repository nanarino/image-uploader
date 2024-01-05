import moon from '@/assets/moon.svg?raw'
import sun from '@/assets/sun.svg?raw'
import { h, defineComponent } from "vue"
import "./index.scss"

const themeTuple = ["dark", "light"] as const

export default defineComponent({
  render() {
    return h('button', {
      id: "themeToggle",
      class: "na-button",
      innerHTML: moon + sun,
      title: "theme toggle",
      ['data-square']: "",
      onclick: () => {
        const theme = themeTuple.at(themeTuple.indexOf(window.theme) - 1)
        if (theme) {
          document.documentElement.dataset["theme"] = theme
          localStorage.setItem("theme", theme)
        }
      }
    })
  }
})
