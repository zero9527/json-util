<template>
  <div class="json-util">
    <DescComp />
    <main class="main">
      <section class="editor">
        <textarea placeholder="输入json文本" @input="onInputChange" />
      </section>
      <Preview :inputJSON="inputJSON" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import DescComp from './Desc.vue';
import Preview from '../JSON-Preview/index.vue';

// [{"name": "a"}, {"name": "b"}]

// JSON格式化
export default defineComponent({
  name: 'JSON-Util',
  components: {
    DescComp,
    Preview,
  },
  setup() {
    const inputJSON = ref<any[] | object>();

    // 输入JSON变化
    const onInputChange = (e: any) => {
      const { value } = e.target;
      inputJSON.value = value;
    };

    return {
      onInputChange,
      inputJSON,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
