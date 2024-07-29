/**
 * 获取系统是否暗黑模式
 * 这个代码要放在body之前 否则可能会有闪烁
 */
Object.defineProperty(window, "theme", {
  get: () =>
    localStorage.getItem("theme") ??
    ["dark", "light"][
      +!window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ],
})
document.documentElement.dataset["theme"] = window.theme
