<template>
  <div class="preview">
    <div v-if="parseError" class="error">
      输入的格式不正确，无法解析！（去掉前后的引号试试）
    </div>
    <div v-else>
      <!-- 数组 -->
      <section v-if="isArray(parsedJSON)">
        <div>[</div>
        <div v-for="(item, index) in parsedJSON" :key="index">
          <render :data="item" />
        </div>
        <div>]</div>
      </section>
      <!-- 对象 -->
      <section v-else-if="isObject(parsedJSON)">
        <div>{</div>
        <div v-for="(item, index) in parsedJSON" :key="index">
          <render :data="item" />
        </div>
        <div>}</div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';
import render from './render.vue';

// 预览
export default defineComponent({
  name: 'JSON-Preview',
  props: {
    inputJSON: String,
  },
  components: {
    render,
  },
  setup(props) {
    const parsedJSON = ref<any[] | object>();
    const parseError = ref<any>(null);

    watch(
      () => props.inputJSON,
      (val: string | undefined) => {
        if (val) parseJson(val);
      },
    );

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

    return {
      parsedJSON,
      parseError,
      isArray,
      isObject,
      render,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
