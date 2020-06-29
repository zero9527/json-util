<template>
  <div id="app">
    <div class="title">JSON-UTIL</div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
  setup() {
    onMounted(() => {
      console.log('App');
    });
  },
});
</script>

<style lang="less">
#app {
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
