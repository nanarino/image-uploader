<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import ImageUploader from '@/components/ImageUploader/index.vue'
import message from '@/components/Message'
import { Gazo } from '@/components/ImageUploader/interface'

const imgs = reactive<Gazo[]>([])
const ImageUploaderRef = ref({ size: 0 })

const change = async (item: {
  file: Gazo;
  action: "append" | "remove";
}) => {
  console.log(item)
  // 变化后 size稍后才响应
  await nextTick()
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
    @overflow="message({ content: `超出数量限制`, primary: `danger` })"
  />
  <p class="na-font-mono">
    {{ imgs.map((x: Gazo) => x.name) }}
  </p>
</template>
