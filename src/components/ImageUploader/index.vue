<script setup lang="ts">
import { ref } from 'vue'
import { FileWithBase64 } from './interface'

const modelValue = defineModel<FileWithBase64[]>({ default: [], local: true })
const props = withDefaults(defineProps<{
  accept?: string[]
  maxCount?: number
}>(), {
  accept: () => ['image/*'],
  maxCount: 10
})

const emit = defineEmits(['update:modelValue', 'onChange'])

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
    alert("已经超出张数！！！")
    return
  }
  await setImgList(e.dataTransfer?.files || [])
}

const setImgList = async (files: FileList | Array<File>) => {
  await Promise.all(Array.from(files).filter((v) => props.accept.filter(t => new RegExp(t).test(v.type)).length).map(fileAdd))
}

const fileAdd = async (file: File) => new Promise<void>((resolve, reject) => {
  size.value += file.size
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    Reflect.set(file, 'src', reader.result)
    modelValue.value.push(<FileWithBase64>file)
    // modelValue.value = [...modelValue.value, <FileWithBase64>file]
    // 这种写法不能让reactive响应 但是无需手动emit
    emit("update:modelValue", modelValue.value)
    emit("onChange", {
      file,
      action: 'append'
    })
    resolve()
  }
})

const updateImg = (e: Event) => {
  if (modelValue.value.length + ((<HTMLInputElement>e.target)?.files?.length || 0) > props.maxCount) {
    alert("已经超出张数！！！")
    return
  }
  setImgList((<HTMLInputElement>e.target)?.files || [])
}
const delImg = (index: number) => {
  size.value -= modelValue.value[index].size
  emit("onChange", {
    file: modelValue.value.at(index),
    action: 'delete'
  })
  modelValue.value.splice(index, 1)
  // modelValue.value = modelValue.value.filter((v, i) => i != index)
  // 这种写法不能让reactive响应 但是无需手动emit
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
      <img :src="item.src">
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
      @drop="drop"
      @dragenter="stopDrag"
      @dragover="stopDrag"
    >
      <input type="file" 
        :accept="`${accept || 'image/*'}`"
        @change="updateImg($event)"
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
      opacity: .8;
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
