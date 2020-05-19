<template>
  <div class="json-util">
    <div>
      <DescComp />
      <button @click="setJson('test1')">test1.json</button>&nbsp;
      <button @click="setJson('tsconfig')">tsconfig.json</button>&nbsp;
      <button @click="setJson('package')">package.json</button>
    </div>
    <main class="main">
      <section class="editor">
        <textarea placeholder="输入json文本" ref="textareaRef" @input="onInputChange" />
      </section>
      <Preview :inputJSON="inputJSON" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import DescComp from './Desc.vue';
import Preview from '../JSON-Preview/index.vue';

// JSON格式化
export default defineComponent({
  name: 'JSON-Util',
  components: {
    DescComp,
    Preview,
  },
  setup() {
    const textareaRef = ref<any>(null);
    const inputJSON = ref<string>();

    // 输入JSON变化
    const onInputChange = (e: any) => {
      const { value } = e.target;
      inputJSON.value = value;
    };

    const setJson = async (name: string) => {
      const { default: res } = await import(`../JSON-Files/${name}.json`);
      const jsonString = JSON.stringify(res);
      textareaRef.value.value = jsonString;
      inputJSON.value = jsonString;
    };

    return {
      textareaRef,
      inputJSON,
      setJson,
      onInputChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
