<script setup lang="ts">
type Numberish = string | number;
const props = withDefaults(
  defineProps<{
    name: string;
    width?: Numberish;
    height?: Numberish;
  }>(),
  {
    width: "1em",
    height: "1em",
  }
);
</script>
<template>
  <svg aria-hidden="true" :width="props.width" :height="props.height">
    <use :xlink:href="`#icon-${props.name.split('/').join('-')}`" />
  </svg>
</template>
