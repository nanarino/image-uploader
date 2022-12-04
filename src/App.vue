<script setup lang="ts">
import { ref, reactive } from 'vue'
import ImageUploader from './components/ImageUploader/index.vue'
import { FileWithBase64 } from './components/ImageUploader/interface'

const data = reactive<FileWithBase64[]>([])
const ImageUploaderRef = ref({ size: 0 })

const submit = () => {
  console.log(...data)
  console.log(ImageUploaderRef.value.size)
}

</script>

<template>
  <div class="upLoad">
    <div class="allbtn">
      <div class="show-btn" @click="submit">点击上传</div>
    </div>
    <ImageUploader v-model:imgList="data" :maxCount="9" :accept="[`image/gif`, `image/jpeg`, `image/png`]"
      ref="ImageUploaderRef" />
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
