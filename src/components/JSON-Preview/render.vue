<script lang="ts">
import Vue from 'vue';
import { isArray, isObject } from '@/utils';

export default Vue.component('render', {
  name: 'render',
  functional: true,
  props: {
    data: [Array, Object],
  },
  render: (h: any, ctx: any) => {
    const util = (data: object) => {
      type DataKey = keyof typeof data;

      return Object.keys(data).map((key: any) =>
        h(
          'div',
          { class: '__item__' },
          isArray(data[key as DataKey])
            ? (data[key as DataKey] as any).map((item: any) => util(item))
            : isObject(data[key as DataKey])
            ? util(data[key as DataKey])
            : [
                h('span', { class: '__key__' }, key.toString()),
                h('span', { class: '__value__' }, data[key as DataKey]),
              ],
        ),
      );
    };

    return h('div', {}, util(ctx.props.data));
  },
});
</script>
