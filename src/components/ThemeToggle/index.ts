import moon from "./moon.svg?raw";
import sun from "./sun.svg?raw";
import { h, defineComponent } from "vue";
import "./index.scss";

const themeTuple = ["dark", "light"] as const;

export default defineComponent({
  render() {
    return h("button", {
      id: "themeToggle",
      class: "na-button",
      innerHTML: moon + sun,
      title: "theme toggle",
      ["data-round"]: "",
      onclick: () => {
        const theme = themeTuple.at(themeTuple.indexOf(window.theme) - 1);
        if (theme) {
          document.documentElement.dataset["theme"] = theme;
          localStorage.setItem("theme", theme);
        }
      },
    });
  },
});
