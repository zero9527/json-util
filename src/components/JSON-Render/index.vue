<script lang="ts">
import { VNode } from 'vue';
import { defineComponent } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';

interface RenderKeyValue {
  index: number;
  key: string;
  dataItem: any;
  value: VNode[] | string[];
}

export default defineComponent({
  name: 'Render',
  props: {
    data: [Array, Object],
    dataPos: String,
  },
  setup(props, ctx) {
    const h = ctx.root.$createElement;

    // 点击"右"三角形
    const onCaretRigthClick = (e: any) => {
      const caretRightElem = e.target.closest('.__caret__.right');
      const valueElem = caretRightElem.nextSibling;
      // 隐藏本身
      caretRightElem.style.display = 'none';
      ctx.emit('caretRightClick', valueElem);
    };

    // 点击"下"三角形
    const onCaretDownClick = (e: any) => {
      const caretDownElem = e.target.closest('.__caret__.down');
      const arrayItem = caretDownElem.nextSibling.nodeValue === '[';
      const itemElem = caretDownElem.closest(arrayItem ? '.__value__' : '.__content__');
      // 显示右三角形
      itemElem.previousSibling.style.display = 'inline-block';
      // 隐藏 value
      ctx.emit('caretDownClick', itemElem);
    };

    // 右三角：收缩
    const caretRight = h('icon-font', {
      props: { icon: 'iconcaret-right' },
      nativeOn: { click: onCaretRigthClick },
    });

    // 下三角：展开
    const caretDown = h('icon-font', {
      props: { icon: 'iconcaret-down' },
      nativeOn: { click: onCaretDownClick },
    });

    const renderItem = (child: (VNode | string)[], caret?: VNode): VNode =>
      h('div', { class: '__item__' }, [caret, h('div', { class: '__content__' }, child)]);
    const renderBlock = (child: VNode[]): VNode =>
      h('div', { class: '__block__' }, child);

    // 返回一个函数相当于 render
    return () => {
      if (!props.data) return h('');

      const util = (data: object | string | any[], dataIndex?: number): VNode[] => {
        // 左括号：展开
        const quoteLeft = h(
          'div',
          { class: '__caret__ down' },
          dataIndex !== undefined ? [caretDown, `[${dataIndex}]: {`] : '{',
        );

        // 括号收起
        const quoteRight = (type: '{}' | '[]', length?: number) => {
          const [quote1, quote2] = type.split('');
          return h(
            'span',
            { class: '__caret__ right' },
            dataIndex !== undefined
              ? [
                  caretRight,
                  length !== undefined
                    ? `[length: ${length}}]: ${quote1}...${quote2}`
                    : `[${dataIndex}}: ${quote1}...${quote2}`,
                ]
              : [caretRight, `${quote1}...${quote2}`],
          );
        };

        // 字符串
        if (!isObject(data) && !isArray(data)) {
          return [renderItem([data as string])];
        }

        // 数组
        if (isArray(data)) {
          return [
            renderItem(
              (data as any).map((item: any, index: number) => util(item, index)),
              quoteRight('[]', (data as any).length),
            ),
          ];
        }

        const dataKeys = Object.keys(data);
        type DataKey = keyof typeof data;

        // 键值对
        const renderKeyValue = ({
          index,
          key,
          dataItem,
          value,
        }: RenderKeyValue): VNode => {
          const dot = index < dataKeys.length - 1 && typeof dataItem !== 'object' && ',';
          const node = [
            h(
              'div',
              [
                h('span', { class: '__key__' }, `"${key}": `),
                value.length > 1 && quoteRight('[]', dataItem.length),
                h('span', { class: `__value__ ${typeof dataItem}` }, value),
                dot,
              ].filter(Boolean),
            ),
          ];
          // 左括号：展开状态
          if (index === 0) node.unshift(quoteLeft);
          // 右括号：收起状态
          if (index === dataKeys.length - 1) node.push(h('div', '},'));
          return renderBlock(node);
        };

        const dataObject = data as object;

        return [
          renderItem(
            dataKeys.map((key: string, index: number) => {
              const value = isArray(dataObject[key as DataKey])
                ? [
                    h('span', [h('span', { class: '__caret__ down' }, [caretDown]), '[']),
                    renderItem([
                      (dataObject[key as DataKey] as any).map((item: any, i: number) =>
                        util(item, i),
                      ),
                      quoteRight('[]', (data[key as DataKey] as any[]).length),
                      h('div', '],'),
                    ]),
                  ]
                : isObject(data[key as DataKey])
                ? [
                    h('span', '{'),
                    renderItem(util(data[key as DataKey], index)),
                    h('div', '}'),
                  ]
                : [`${data[key as DataKey]}`];
              return renderKeyValue({
                index,
                key,
                dataItem: data[key as DataKey],
                value,
              });
            }),
            quoteRight('{}'),
          ),
        ];
      };

      // 字符串
      if (!isArray(props.data) && !isObject(props.data)) {
        return h('div', props.data);
      }

      // 数组
      if (isArray(props.data)) {
        return renderItem([
          '[',
          props.data.map((item: any, index: number) => util(item, index)),
          ']',
        ]);
      }

      // 对象
      return renderItem(util(props.data));
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
