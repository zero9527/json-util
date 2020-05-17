<script lang="ts">
import { VNode } from 'vue';
import { defineComponent } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';

interface RenderKeyValue {
  lastOne: boolean;
  index: number;
  key: string;
  dataItem: any;
  value: (VNode | string)[];
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

      const util = (
        utilLastOne: boolean,
        parentData: any,
        data: object | string | any[],
        dataIndex?: number,
      ): VNode[] => {
        // 左括号：展开状态
        const quoteDown = (inline: boolean) =>
          h(
            inline ? 'span' : 'div',
            { class: '__caret__ down' },
            !isArray(parentData)
              ? [caretDown, '{']
              : dataIndex !== undefined
              ? [caretDown, `[${dataIndex}]: {`]
              : '{',
          );

        // 括号收起状态
        const quoteRight = (type: '{}' | '[]', lastOne: boolean, number?: number) => {
          const [quote1, quote2] = type.split('');
          const _quote2 = `${quote2}${!lastOne ? ',' : ''}`;
          const node = [
            caretRight,
            number !== undefined
              ? `[length: ${number}]: ${quote1}...${_quote2}`
              : `[${dataIndex}]: ${quote1}...${_quote2}`,
          ];
          return h('span', { class: '__caret__ right' }, node);
        };

        // 字符串
        if (typeof data === 'string') {
          return [renderItem([data as string])];
        }

        // 数组
        if (isArray(data)) {
          return [
            renderItem(
              (data as any).map((item: any, index: number) =>
                util(index === (data as any[]).length - 1, data, item, index),
              ),
              quoteRight('[]', true, (data as any[]).length),
            ),
          ];
        }

        const dataKeys = Object.keys(data);
        type DataKey = keyof typeof data;

        // 键值对
        const renderKeyValue = ({
          lastOne,
          index,
          key,
          dataItem,
          value,
        }: RenderKeyValue): VNode => {
          const emptyObject = isObject(dataItem) && !Object.keys(dataItem).length;
          const dot = !lastOne && !isObject(dataItem) && !isArray(dataItem) && ',';
          const node = [
            h('div', [
              h('span', { class: '__key__' }, `"${key}": `),
              value.length > 1 && quoteRight('[]', lastOne, (dataItem as any[]).length),
              h(
                'span',
                { class: `__value__ ${typeof dataItem}` },
                emptyObject ? ['{}', !lastOne && ','] : value,
              ),
              dot,
            ]),
          ];

          // 左括号：展开状态
          if (index === 0) node.unshift(quoteDown(emptyObject));
          // 右括号：收起状态
          if (index === dataKeys.length - 1) node.push(h('div', '},'));
          return renderBlock(node);
        };

        const dataObject = data as object;

        // 对象
        return [
          renderItem(
            dataKeys.map((key: string, index: number) => {
              const lastOne = index === dataKeys.length - 1;
              const arrayValue =
                isArray(dataObject[key as DataKey]) &&
                (dataObject[key as DataKey] as any).length
                  ? [
                      h('span', [
                        h('span', { class: '__caret__ down' }, [caretDown]),
                        '[',
                      ]),
                      renderItem([
                        (dataObject[key as DataKey] as any).map((item: any, i: number) =>
                          util(
                            index === (dataObject[key as DataKey] as any).length - 1,
                            dataObject[key as DataKey],
                            item,
                            i,
                          ),
                        ),
                        quoteRight(
                          '[]',
                          lastOne,
                          (dataObject[key as DataKey] as any[]).length,
                        ),
                        h('div', !lastOne ? '],' : ']'),
                      ]),
                    ]
                  : !lastOne
                  ? [h('span', '[]'), ',']
                  : [h('span', '[]')];
              const value = isArray(dataObject[key as DataKey])
                ? arrayValue
                : isObject(data[key as DataKey])
                ? [renderItem(util(lastOne, data, data[key as DataKey], index))]
                : [`${data[key as DataKey]}`];
              return renderKeyValue({
                lastOne,
                index,
                key,
                dataItem: data[key as DataKey],
                value,
              });
            }),
            quoteRight('{}', utilLastOne),
          ),
        ];
      };

      // 字符串
      if (typeof props.data === 'string') {
        return h('div', props.data);
      }

      // 数组
      if (isArray(props.data)) {
        return renderItem([
          '[',
          props.data.map((item: any, index: number) =>
            util(index === props.data.length, props.data, item, index),
          ),
          ']',
        ]);
      }

      // 对象
      return renderItem(util(true, null, props.data));
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
