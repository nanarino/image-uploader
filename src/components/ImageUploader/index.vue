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
  <div class="upWin">
    <div class="photobox" @drop="drop($event)" @dragenter="stopDrag($event)" @dragover="stopDrag($event)">
      <div class="photo-item" v-show="modelValue.length > 0" v-for="(item, index) in modelValue" :key="index">
        <div class="pic-del">
          <i class="iconfont icon-shanchu del" @click="delImg(index)"></i>
        </div>
        <div class="pic-img">
          <img :src="item.src" alt="">
        </div>
        <div class="pic-name">{{ item.name }}</div>
      </div>
      <div class="photo-item-btn">
        <input type="file" :accept="`${accept || 'image/*'}`" class="fileimg" @change="updateImg($event)" multiple />
        <i class="iconfont icon-tianjia"></i>
        <span>点击添加或拖拽图片</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upWin {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  width: 1200px;
  min-height: 500px;
  height: 700px;
  font-size: 12px;
  border-radius: 5px;
  box-shadow: 0 0 5px #535658;
}

.photobox {
  overflow: hidden;
  padding: 30px 15px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff
}

.photo-item {
  position: relative;
  float: left;
  margin: 0 15px 10px;
  width: 198px;
  height: 198px;
  text-align: center;
  border: 1px solid #e1e1e1;
}

.photo-item:hover .pic-del {
  display: block;
}

.photo-item .pic-del {
  display: none;
  position: absolute;
  bottom: 40px;
  left: 0;
  padding-right: 6px;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, .3);
  box-sizing: border-box;
}

.photo-item .pic-del .del {
  float: right;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}

.photo-item .pic-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 158px;
}

.photo-item .pic-img img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.photo-item .pic-name {
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #666;
  background-color: #eee;
  box-sizing: border-box;
}

.photo-item-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  float: left;
  margin: 0 15px 10px;
  width: 198px;
  height: 198px;
  border: 1px dashed #e1e1e1;
  border-radius: 6px;
  font-size: 16px;
  color: #ccc;
}

.photo-item-btn i {
  font-size: 40px;
  margin-bottom: 20px;
}

.photo-item-btn .fileimg {
  position: absolute;
  top: 0;
  left: 0;
  width: 198px;
  height: 198px;
  opacity: 0;
  cursor: pointer;
}
</style>
