<script setup lang="ts">
import { ref, reactive } from 'vue'
import ImageUploader from './components/ImageUploader/index.vue'
import { Gazo } from './components/ImageUploader/interface'

const imgs = reactive<Gazo[]>([{
  url: '/FhwytrFUUAIX0L7.png',
  name: 'Kirby.png',
  size: 557136,
  type: "image/png"
}])
const ImageUploaderRef = ref({ size: 0 })

const change = (item: {
    file: Gazo;
    action: "append" | "remove";
}) => {
  console.log(item)
  console.log(ImageUploaderRef.value.size)
}
</script>

<template>
  <ImageUploader 
    v-model="imgs"
    :maxCount="9"
    :accept="[`image/gif`, `image/jpeg`, `image/png`]"
    ref="ImageUploaderRef"
    @change="change"
    @overflow="console.log(`超出数量限制`)"
  />

  <p>
    {{ imgs.map((x: Gazo) => x.name) }}
  </p>
</template>
