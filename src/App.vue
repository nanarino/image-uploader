<script setup lang="ts">
import { ref, nextTick } from "vue"
import { ImageUploader, Image } from "@/components/ImageUploader"
import message from "@/components/Message"
import ThemeToggle from "@/components/ThemeToggle"

/**
 * 如果使用 `reactive` 会有报错：
 *  `This assignment will throw because "imgs" is a constant`
 * 但是不影响使用 也可以不使用 `v-model`
 */
const imgs = ref<Image[]>([])
const ImageUploaderRef = ref<InstanceType<typeof ImageUploader>>()

const change = async (item: {
  images: Image[]
  action: "append" | "remove"
}) => {
  console.log(item)
  // 变化后 size稍后才响应
  await nextTick()
  console.log(ImageUploaderRef.value?.size)
}

void (async function init() {
  const res = await fetch(`${import.meta.env.BASE_URL}data/Kirby.json`)
  const Kirby = (await res.json()) as Image
  if (Kirby.url) Kirby.url = Kirby.url.replace(/^\//, import.meta.env.BASE_URL)
  imgs.value.push(Kirby)
})()
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
    {{ imgs.map((x: Image) => x.name) }}
  </p>
  <ThemeToggle />
</template>
