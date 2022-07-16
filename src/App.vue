<script setup lang="ts">
import { ref, reactive } from 'vue'
import ImageUploader from './components/ImageUploader.vue'

interface FileWithBase64 extends File {
  src: string
}

const data = ref({ imgList: reactive<FileWithBase64[]>([]) })

const submit = () => {
  console.log(Array.from(data.value.imgList))
}

</script>

<template>
  <div class="upLoad">
    <div class="allbtn">
      <div class="show-btn" @click="submit">点击上传</div>
    </div>
    <ImageUploader :maxCount="9" :accept="[`image/gif`, `image/jpeg`, `image/png`]" ref="data" />
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
