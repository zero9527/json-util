<template>
  <div class="sub-app">
    <h3>sub-app</h3>
    <div id="app-clock" />
    <div id="app-calendar" />
    <div id="app-reacttest" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { mountParcel } from '@/main';

export default defineComponent({
  name: 'SubApp',
  setup() {
    onMounted(() => {
      mountParcelHandler('@vue-mf/clock', 'app-clock');
      // mountParcelHandler('@vue-mf/calendar', 'app-calendar');
      mountParcelHandler('@react-mf/test', 'app-reacttest');
    });

    const mountParcelHandler = (appName: string, domElementId: string) => {
      const parcelConfig = (window as any).System.import(appName);
      const domElement = document.getElementById(domElementId);
      mountParcel(parcelConfig, { domElement });
    };
  },
});
</script>

<style lang="less"></style>
