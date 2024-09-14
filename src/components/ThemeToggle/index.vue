<script setup lang="ts">
import { Icon } from "@/components/Icons"
import toggle from "@holy-two/data-theme/dist/toggle"
</script>
<template>
  <button class="na-button" title="theme toggle" data-round @click="toggle">
    <Icon name="moon" />
    <Icon name="sun" />
  </button>
</template>
<style scoped lang="scss">
button {
  position: fixed;
  z-index: 9;
  bottom: 16px;
  left: 16px;

  display: grid;
  --padding-horizonal-button: 16px;

  svg {
    grid-area: 1/1/2/2;
    transition: opacity 0.3s;
    font-size: 24px;
  }
}

:root[data-theme="light"] {
  button {
    svg:first-child {
      opacity: 0;
    }
  }
}

:root[data-theme="dark"] {
  button {
    svg:last-child {
      opacity: 0;
    }
  }
}
</style>
