<script setup lang="ts">
import { ref, reactive } from 'vue'
import ImageUploader from './components/ImageUploader/index.vue'
import { Gazo } from './components/ImageUploader/interface'

const imgs = reactive<Gazo[]>([])
const ImageUploaderRef = ref({ size: 0 })

const change = (item: {
    file: Gazo;
    action: "append" | "remove";
}) => {
  console.log(item)
  console.log(ImageUploaderRef.value.size)
}

void async function init() {
  const res = await fetch('/Kirby.json')
  const Kirby = await res.json()
  imgs.push(Kirby)
}()
</script>

<template>
  <ImageUploader 
    v-model="imgs"
    :max-count="9"
    :accept="[`image/gif`, `image/jpeg`, `image/png`]"
    ref="ImageUploaderRef"
    @change="change"
    @overflow="console.log(`超出数量限制`)"
  />

  <p class="na-font-mono">
    {{ imgs.map((x: Gazo) => x.name) }}
  </p>
</template>
