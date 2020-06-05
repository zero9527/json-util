<template>
  <section class="preview">
    <div v-if="parseError" class="error">
      输入的格式不正确，无法解析！（去掉前后的引号试试）
      <p>{{ parseError }}</p>
    </div>
    <div class="loading" v-if="loading">正在解析...</div>
    <template v-else>
      <Render :data="parsedJSON" @unFoldClick="onUnFoldClick" @foldClick="onFoldClick" />
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';
import Render from '../JSON-Render/index.vue';

/**
 * TODO：
 * 1、渲染loading
 * 2、最顶层不收起、展开
 * 3、key的在JSON中的位置
 */

// 预览
export default defineComponent({
  name: 'JSON-Preview',
  props: {
    inputJSON: String,
  },
  components: {
    Render,
  },
  setup(props) {
    const parsedJSON = ref<any[] | object>();
    const parseError = ref<any>(null);
    const loading = ref(false);

    // 输入JSON变化
    const parseJson = (val: string) => {
      loading.value = true;
      parseError.value = false;
      parsedJSON.value = undefined;
      try {
        parsedJSON.value = JSON.parse(`${val}`);
        // console.log(parsedJSON.value);
        setTimeout(() => {
          loading.value = false;
        }, 0);
      } catch (error) {
        console.error(error);
        parseError.value = error;
        loading.value = false;
      }
    };

    watch(
      () => props.inputJSON,
      (val: string | undefined) => {
        if (val) parseJson(val);
      },
    );

    // 点击加号：展开
    const onUnFoldClick = (valueElement: HTMLElement) => {
      if (valueElement) valueElement.style.display = '';
    };

    // 点击减号：收起
    const onFoldClick = (valueElement: HTMLElement) => {
      if (valueElement) valueElement.style.display = 'none';
    };

    return {
      loading,
      parsedJSON,
      parseError,
      isArray,
      isObject,
      onUnFoldClick,
      onFoldClick,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
