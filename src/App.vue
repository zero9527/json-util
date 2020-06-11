<template>
  <div id="json-util">
    <div class="title">JSON-UTIL</div>
    <div id="app-calendar"></div>
    <JSONUtil />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AsyncComponent from '@/components/AsyncComponent';

const JSONUtil = AsyncComponent(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'json-util' */
    '@/components/JSON-Util/index.vue'
  ),
);

export default Vue.extend({
  name: 'App',
  components: {
    JSONUtil,
  },
});
</script>

<style lang="less">
#json-util {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}

.title {
  padding: 10px 0;
  font-size: 22px;
  color: #2196f3;
  text-align: center;
  text-shadow: 1px 3px 4px rgba(33, 150, 243, 0.5);
}

@media screen and (max-width: 600px) {
  html {
    font-size: 14px;
  }
}
</style>
