<template>
  <div
    class="tooltip-wrapper"
    :class="{ [wrapperClass]: Boolean(wrapperClass) }"
  >
    <slot name="default" />
    <section class="content">
      <slot name="content" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

// 悬浮窗
export default defineComponent({
  name: 'Tooltip',
  props: {
    wrapperClass: String,
  },
  setup(props, ctx) {
    return {
      slots: ctx.slots,
    };
  },
});
</script>

<style lang="less" scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;

  &:hover {
    .content {
      display: block;
    }
  }

  > span {
    padding-right: 20px;
  }

  .content {
    width: max-content;
    max-width: 500px;
    display: none;
    position: absolute;
    top: -50%;
    left: 100%;
    padding: 8px 16px;
    z-index: 2;
    color: #666;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.2);

    &::before {
      content: '';
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      left: -10px;
      background: #fff;
      transform: rotate(-45deg);
      box-shadow: -8px -4px 12px -5px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    li {
      line-height: 1.6;
    }
  }
}
</style>
