<script lang="ts">
import { VNode } from 'vue';
import { defineComponent } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';

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
      console.log('caretRightElem: ', caretRightElem);
      console.log('valueElem: ', valueElem);
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

    // 返回一个函数相当于 render
    return () => {
      const renderItem = (child: VNode[], caret?: VNode): VNode =>
        h('div', { class: '__item__' }, [
          caret,
          h('div', { class: '__content__' }, child),
        ]);
      const renderBlock = (child: VNode[]): VNode =>
        h('div', { class: '__block__' }, child);

      const util = (data: any, dataIndex?: number): VNode[] => {
        const dataKeys = Object.keys(data);
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
                    ? `${quote1}...${quote2}` // `[length: ${length}}]: ${quote1}...${quote2}`
                    : `[${dataIndex}}]: ${quote1}...${quote2}`,
                ]
              : `${quote1}...${quote2}`,
          );
        };
        const renderKeyValue = (
          index: number,
          key: string,
          value: VNode[] | string[],
        ): VNode => {
          const node = [
            h('div', [
              h('span', { class: '__key__' }, `"${key}": `),
              quoteRight('[]', value.length),
              h('span', { class: '__value__' }, [...value, ',']),
            ]),
          ];
          if (index === 0) node.unshift(quoteLeft); // 左括号：展开
          if (index === dataKeys.length - 1) node.push(h('div', '},')); // 右括号
          return renderBlock(node);
        };

        // 字符串
        if (!isObject(data) && !isArray(data)) {
          return [renderItem([data])];
        }

        // 数组
        if (isArray(data)) {
          return [
            renderItem(
              data.map((item: any, index: number) => util(item, index)),
              quoteRight('[]', data.length),
            ),
          ];
        }

        return [
          renderItem(
            dataKeys.map((key: string, index: number) => {
              const value = isArray(data[key])
                ? [
                    h('span', [h('span', { class: '__caret__ down' }, [caretDown]), '[']),
                    renderItem(
                      data[key].map((item: any, i: number) => util(item, i)),
                      quoteRight('[]', data[key].length),
                    ),
                    h('div', '],'),
                  ]
                : isObject(data[key])
                ? [h('span', '{'), renderItem(util(data[key], index)), h('div', '}')]
                : [`${data[key]}`];
              return renderKeyValue(index, key, value);
            }),
            quoteRight('{}'),
          ),
        ];
      };

      // 数组
      if (isArray(props.data)) {
        return renderItem([
          '[',
          props.data.map((item: any, index: number) => renderItem(util(item, index))),
          '],',
        ]);
      }

      if (!props.data) return;

      // 对象
      return renderItem(util(props.data));
    };
  },
});
</script>

<style lang="less" scoped>
.__item__ {
  position: relative;
  padding-left: 16px;

  // &::before {
  //   content: '';
  //   width: 1px;
  //   height: calc(100% - 20px);
  //   display: block;
  //   position: absolute;
  //   margin-left: 8px;
  //   margin-top: 20px;
  //   background: #ccc;
  // }

  .__caret__ {
    display: inline-flex;
    align-items: center;

    &.right {
      display: none;
    }
  }

  .__key__ {
    margin-right: 4px;
    padding-left: 20px;
    color: #ff5722;
  }

  .__value__ {
    // display: inline-block;
  }
}
.__block__ {
  display: block;
}
</style>
