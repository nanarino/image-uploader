<script setup lang="ts">
import { ref } from 'vue'
import { FileWithBase64 } from './interface'

const props = withDefaults(defineProps<{
  accept?: string[]
  maxCount?: number,
  modelValue?: FileWithBase64[]
}>(), {
  accept: () => ['image/*'],
  maxCount: 10,
  modelValue: () => <FileWithBase64[]>([])
})

const emit = defineEmits(['update:modelValue', 'onChange'])

const size = ref(0)
defineExpose({ size }) //`defineExpose` is a compiler macro and no longer needs to be imported

const stopDrag = (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
}
const drop = (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
  if (props.modelValue.length + (e.dataTransfer?.files?.length || 0) > props.maxCount) {
    alert("已经超出张数！！！")
    return
  }
  setImgList(e.dataTransfer?.files || [])
}

const setImgList = (files: FileList | Array<File>) => {
  Array.from(files).filter((v) => props.accept.filter(t => new RegExp(t).test(v.type)).length).forEach(fileAdd)
}

const fileAdd = (file: File) => {
  size.value += file.size
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    Reflect.set(file, 'src', reader.result)
    props.modelValue.push(<FileWithBase64>file)
    emit("update:modelValue", props.modelValue)
    emit("onChange", {
      file,
      active: 'append'
    })
  }
}

const updateImg = (e: Event) => {
  if (props.modelValue.length + ((<HTMLInputElement>e.target)?.files?.length || 0) > props.maxCount) {
    alert("已经超出张数！！！")
    return
  }
  setImgList((<HTMLInputElement>e.target)?.files || [])
}
const delImg = (index: number) => {
  size.value -= props.modelValue[index].size
  emit("onChange", {
    file: props.modelValue.at(index),
    active: 'delete'
  })
  props.modelValue.splice(index, 1)
  emit("update:modelValue", props.modelValue)
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
        <input type="file" :accept="`${accept || 'image/*'}`" class="fileimg" ref="updateimg" @change="updateImg($event)"
          multiple />
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
