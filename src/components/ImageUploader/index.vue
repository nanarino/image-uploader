<script setup lang="ts">
import { ref } from 'vue'
import { Gazo } from './interface'

const modelValue = defineModel<Gazo[]>({ default: [], local: true })
const props = withDefaults(defineProps<{
  accept?: string[]
  maxCount?: number
}>(), {
  accept: () => ['image/*'],
  maxCount: Infinity
})

const emit = defineEmits<{
  (event: 'update:modelValue', item: Gazo[]): void
  (event: 'change', item: { file: Gazo, action: 'append'|'remove' }): void
  (event: 'overflow'): void
}>()

const size = ref(0)
defineExpose({ size })

const stopDrag = (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
}
const drop = async (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
  if (modelValue.value.length + (e.dataTransfer?.files?.length || 0) > props.maxCount) {
    return emit("overflow")
  }
  await setImgList(e.dataTransfer?.files || [])
}

const setImgList = async (files: FileList | Array<File>) => {
  await Promise.all(Array.from(files).filter((v) => props.accept.filter(t => new RegExp(t).test(v.type)).length).map(fileAdd))
}

const fileAdd = async (file: File) => new Promise<void>((resolve, reject) => {
  size.value += file.size
  // const url = URL.createObjectURL(file)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    Reflect.set(file, 'url', reader.result)
    modelValue.value.push(file)
    // 还是需手动emit 它没有提供defineModels那样的deep选项 只能对简单类型自动emit
    emit("update:modelValue", modelValue.value)
    emit("change", {
      file,
      action: 'append'
    })
    resolve()
  }
})

const updateImg = async (e: Event) => {
  const files = (<HTMLInputElement>e.target)?.files || <File []>[]
  if (modelValue.value.length + files.length <= props.maxCount) {
    await setImgList(files)
  } else {
    emit("overflow")
  }
  (<HTMLInputElement>e.target).value = ''
}
const delImg = (index: number) => {
  size.value -= modelValue.value[index].size
  emit("change", {
    file: modelValue.value.at(index) as Gazo,
    action: 'remove'
  })
  modelValue.value.splice(index, 1)
  // 还是需手动emit 它没有提供defineModels那样的deep选项 只能对简单类型自动emit
  emit("update:modelValue", modelValue.value)
}
</script>

<template>
  <div class="na-image-uploader">
    <div class="na-image" 
      v-show="modelValue.length > 0"
      v-for="(item, index) of modelValue" 
      :key="index"
    >
      <img :src="item.url" @dragstart="stopDrag">
      <div class="na-image-footer">
        <div class="na-image-footer-content">
          <div class="na-paragraph" data-ellipsis="2">
            {{ item.name }}
          </div>
        </div>
        <div class="na-image-footer-action">
          <i class="na-link iconfont icon-shanchu" 
            @click="delImg(index)"
          />
        </div>
      </div>
    </div>
    <div class="na-image"
      v-show="modelValue.length < props.maxCount"
      @drop="modelValue.length < props.maxCount ? drop($event) : stopDrag($event)"
      @dragenter="stopDrag"
      @dragover="stopDrag"
    >
      <input type="file"
        :accept="`${accept || 'image/*'}`"
        @change="updateImg"
        multiple
      />
      <i class="na-link iconfont icon-tianjia" />
      <span>点击添加或拖拽图片</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.na-image-uploader{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media screen and (max-width: 876px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 540px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 360px) {
    grid-template-columns: 1fr;
  }

  .na-image{
    aspect-ratio: 1 / 1;
    border-radius: var(--border-radius-lg);

    &:has(input[type=file]){
      display: flex;
      gap: 16px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: rgb(var(--primary-6));
      border: 2px dashed rgb(var(--primary-6));
      opacity: .5;
    }

    input[type=file]{
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .na-link{
      font-size: 40px;
    }
    
    .na-image-footer-action>.na-link{
      font-size: 32px;
    }
  }
}
</style>
