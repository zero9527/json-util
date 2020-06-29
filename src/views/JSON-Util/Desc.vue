<template>
  <div class="desc">
    <Tooltip>
      <span>说明 <icon-font icon="iconinfo"/></span>
      <template v-slot:content>
        <b>JSON格式化工具：</b>
        <li>格式化JSON文本，如：[{"name": "a"}, {"name": "b"}]</li>
        <li>收缩JSON文本：数组、对象</li>
        <li>显示鼠标所在JSON文本的某个属性的位置</li>
      </template>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Tooltip from '@/components/Tooltip/index.vue';

export default defineComponent({
  name: 'Desc-comp',
  components: {
    Tooltip,
  },
});
</script>

<style lang="less" scoped>
.desc {
  position: relative;
  display: inline-block;
  padding: 0 16px 6px;
}
</style>
