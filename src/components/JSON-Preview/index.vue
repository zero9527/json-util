<template>
  <div class="preview">
    <div v-if="parseError" class="error">
      输入的格式不正确，无法解析！（去掉前后的引号试试）
    </div>
    <template v-else>
      <Render
        :data="parsedJSON"
        @caretDownClick="caretDownClick"
        @caretRightClick="caretRightClick"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';
import Render from './Render.vue';

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

    // 输入JSON变化
    const parseJson = (val: string) => {
      parseError.value = false;
      parsedJSON.value = undefined;
      try {
        parsedJSON.value = JSON.parse(`${val}`);
        console.log(parsedJSON.value);
      } catch (error) {
        console.error(error);
        parseError.value = true;
      }
    };

    watch(
      () => props.inputJSON,
      (val: string | undefined) => {
        if (val) parseJson(val);
      },
    );

    // 展开
    const caretRightClick = (valueElement: any) => {
      if (valueElement) valueElement.style.display = 'unset';
    };

    // 收起
    const caretDownClick = (valueElement: any) => {
      if (valueElement) valueElement.style.display = 'none';
    };

    return {
      parsedJSON,
      parseError,
      isArray,
      isObject,
      caretDownClick,
      caretRightClick,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
