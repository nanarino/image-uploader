<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader/index.vue'
import { FileWithBase64 } from './components/ImageUploader/interface'

const imgs = ref<FileWithBase64[]>([]) // 只能使用`ref`如果要使用reactive需要自己处理：在`@update:modelValue`中`imgs.splice`
const ImageUploaderRef = ref({ size: 0 })

const change = (...args: any) => {
  console.log(...args)
  console.log(ImageUploaderRef.value.size)
}
</script>

<template>
  {{ imgs.map((x: FileWithBase64) => x.name) }}
  <div class="upLoad">
    <ImageUploader v-model="imgs" :maxCount="9" :accept="[`image/gif`, `image/jpeg`, `image/png`]"
      ref="ImageUploaderRef" @onChange="change"/>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.upLoad {
  position: relative;
}

.allbtn {
  padding: 20px;
  display: flex;
}

.show-btn {
  margin-right: 10px;
  padding: 10px;
  background-color: #5caae6;
  cursor: pointer;
}
</style>
