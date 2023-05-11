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
