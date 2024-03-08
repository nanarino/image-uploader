<script setup lang="ts">
import { computed } from "vue";
import { Gazo } from "./interface";

const images = defineModel<Gazo[]>("modelValue", { default: () => [] });
const props = withDefaults(
  defineProps<{
    accept?: string[];
    maxCount?: number;
  }>(),
  {
    accept: () => ["image/*"],
    maxCount: Infinity,
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", item: Gazo[]): void;
  (event: "change", item: { file: Gazo; action: "append" | "remove" }): void;
  (event: "overflow"): void;
}>();

const stopDrag = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
const drop = async (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (
    images.value.length + (e.dataTransfer?.files?.length || 0) >
    props.maxCount
  ) {
    return emit("overflow");
  }
  await setImgList(e.dataTransfer?.files || []);
};

const setImgList = async (files: FileList | Array<File>) => {
  await Promise.all(
    Array.from(files)
      .filter(
        (v) => props.accept.filter((t) => new RegExp(t).test(v.type)).length
      )
      .map(fileAdd)
  );
};

const fileAdd = async (file: File) =>
  new Promise<void>((resolve, reject) => {
    // const url = URL.createObjectURL(file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      Reflect.set(file, "url", reader.result);
      images.value.push(file);
      // 还是需手动emit 它没有提供defineModels那样的deep选项 只能对简单类型自动emit
      emit("update:modelValue", images.value);
      emit("change", {
        file,
        action: "append",
      });
      resolve();
    };
  });

const updateImg = async (e: Event) => {
  const files = (<HTMLInputElement>e.target)?.files || <File[]>[];
  if (images.value.length + files.length <= props.maxCount) {
    await setImgList(files);
  } else {
    emit("overflow");
  }
  (<HTMLInputElement>e.target).value = "";
};
const delImg = (index: number) => {
  emit("change", {
    file: images.value.at(index) as Gazo,
    action: "remove",
  });
  images.value.splice(index, 1);
  // 还是需手动emit 它没有提供defineModels那样的deep选项 只能对简单类型自动emit
  emit("update:modelValue", images.value);
};

const size = computed(() =>
  images.value.reduce((size, file) => size + file.size, 0)
);
defineExpose({ size });
</script>

<template>
  <div class="na-image-uploader">
    <div
      class="na-image"
      v-show="images.length > 0"
      v-for="(item, index) of modelValue"
      :key="index"
    >
      <img :src="item.url" @dragstart="stopDrag" />
      <div class="na-image-footer">
        <div class="na-image-footer-content">
          <div class="na-paragraph" data-ellipsis="2">
            {{ item.name }}
          </div>
        </div>
        <div class="na-image-footer-action">
          <i class="na-link iconfont icon-shanchu" @click="delImg(index)" />
        </div>
      </div>
    </div>
    <div
      class="na-image na-input-wrapper"
      v-show="images.length < props.maxCount"
      @drop="images.length < props.maxCount ? drop($event) : stopDrag($event)"
      @dragenter="stopDrag"
      @dragover="stopDrag"
      data-primary
    >
      <input
        type="file"
        class="na-input"
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
.na-image-uploader {
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

  .na-image {
    aspect-ratio: 1 / 1;
    border-radius: var(--border-radius-md);

    .na-link {
      font-size: 40px;
    }

    .na-image-footer-action > .na-link {
      font-size: 32px;
    }
  }
}
</style>
