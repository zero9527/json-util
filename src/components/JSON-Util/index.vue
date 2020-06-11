<template>
  <div class="json-util">
    <div id="app-clock"></div>
    <div>
      <DescComp />
      <button @click="setJson('vue_composition_api-package')">
        vue_composition_api-package.json</button
      >&nbsp; <button @click="setJson('test1')">test1.json</button>&nbsp;
      <button @click="setJson('tsconfig')">tsconfig.json</button>&nbsp;
      <button @click="setJson('package')">package.json</button>&nbsp;
      <router-link to="/sub-app">sub-app</router-link>
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
import { defineComponent, ref, watch, onMounted } from '@vue/composition-api';
import { mountParcel } from '@/main';
import DescComp from './Desc.vue';
import Preview from '../JSON-Preview/index.vue';

// JSON格式化
export default defineComponent({
  name: 'JSON-Util',
  components: {
    DescComp,
    Preview,
  },
  setup(props, ctx) {
    const textareaRef = ref<any>(null);
    const inputJSON = ref<string>();
    const parcel = ref<any>(null);

    const mountClockParcel = () => {
      const routePath = ctx.root.$route.path;
      const domElement = document.getElementById('app-clock');
      if (routePath === '/sub-app' && domElement) {
        const parcelConfig = (window as any).System.import('@vue-mf/clock');
        parcel.value = mountParcel(parcelConfig, { domElement });
      } else if (parcel.value) {
        parcel.value.unmount();
      }
    };

    onMounted(() => {
      mountClockParcel();
    });

    watch(
      () => ctx.root.$route.path,
      () => {
        mountClockParcel();
      },
    );

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
