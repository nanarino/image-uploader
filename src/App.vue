<script setup lang="ts">
import { ref, reactive } from 'vue'
import ImageUploader from './components/ImageUploader/index.vue'
import { FileWithBase64 } from './components/ImageUploader/interface'

const imgs = reactive<FileWithBase64[]>([])
const ImageUploaderRef = ref({ size: 0 })

const change = (...args: any) => {
  console.log(...args)
  console.log(ImageUploaderRef.value.size)
}
</script>

<template>
  <p>
    {{ imgs.map((x: FileWithBase64) => x.name) }}
  </p>
  
  <ImageUploader 
    v-model="imgs"
    :maxCount="9"
    :accept="[`image/gif`, `image/jpeg`, `image/png`]"
    ref="ImageUploaderRef"
    @onChange="change"
  />
</template>
