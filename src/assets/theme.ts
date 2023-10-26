document.documentElement.dataset["theme"] = ["dark", "light"][
  +!window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
];