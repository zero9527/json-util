<template>
  <div class="loading">
    <p>拼命加载中...</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
};
</script>

<style lang="less" scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
