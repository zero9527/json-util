<script lang="ts">
import { VNode } from 'vue';
import { defineComponent } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';

// 对象键值对
interface RenderKeyValue {
  lastOne: boolean;
  key: string;
  dataItem: any;
  value: (VNode | string)[];
}

// 括号收起状态
interface BracketsRight {
  brackets: '{}' | '[]';
  lastOne: boolean;
  index?: number;
  length?: number;
}

// 渲染逻辑
export default defineComponent({
  name: 'Render',
  props: {
    data: [Array, Object],
    dataPos: String,
  },
  setup(props, ctx) {
    const h = ctx.root.$createElement;

    // 点击"右"三角形：展开
    const onCaretRigthClick = (e: any) => {
      const caretRightElem = e.target.closest('.__caret__.right') as HTMLElement;
      const brackets1Elem = caretRightElem.parentNode!.querySelector(
        '.__value__ .__brackets1__',
      ) as HTMLElement;
      const arrayItem = caretRightElem.getAttribute('type') === 'array';
      // 普通key的对象
      let valueElem = caretRightElem.parentElement!.querySelector(
        arrayItem ? '.__item__' : '.__value__.object',
      );
      // 数组key的对象
      if (!valueElem) {
        valueElem = caretRightElem.parentElement!.querySelector('.__content__');
      }
      caretRightElem.style.display = 'none';
      brackets1Elem.style.display = '';
      ctx.emit('caretRightClick', valueElem);
    };

    // 点击"下"三角形：收起
    const onCaretDownClick = (e: any) => {
      const brackets1Elem = e.target.closest('.__brackets1__');
      const arrayItem = brackets1Elem.getAttribute('type') === 'array';
      const valueElem = arrayItem ? brackets1Elem.nextSibling : brackets1Elem.parentNode;
      // 右三角形
      const caretRightElem = arrayItem
        ? brackets1Elem.previousSibling
        : valueElem.previousSibling;

      brackets1Elem.style.display = 'none';
      caretRightElem.style.display = 'inline-block';
      // 隐藏 value
      ctx.emit('caretDownClick', valueElem);
    };

    // 右三角：收起状态
    const caretRight = h('icon-font', {
      props: { icon: 'iconplus-square-o' },
      attrs: { title: '点击展开' },
      nativeOn: { click: onCaretRigthClick },
    });

    // 下三角：展开状态
    const caretDown = h('icon-font', {
      props: { icon: 'iconminus-square-o' },
      attrs: { title: '点击收起' },
      nativeOn: { click: onCaretDownClick },
    });

    const renderItem = (child: (VNode | string)[], bracketsRight?: VNode): VNode => {
      return h('div', { class: '__item__' }, [
        bracketsRight || '',
        h('div', { class: '__content__' }, child),
      ]);
    };

    const renderBlock = (child: (VNode | string)[]): VNode =>
      h('div', { class: '__block__' }, child);

    const emptyBrakets = (brackets: '{}' | '{},' | '[]' | '[],') => {
      return h('span', { class: '__brackets1__ __brackets2__' }, brackets);
    };

    // 展开状态 -- 左括号
    const bracketsDownStart = (brackets: '{' | '[', index?: number) => {
      const type = brackets === '{' ? 'object' : 'array';
      return h('span', { class: '__brackets1__', attrs: { type } }, [
        h('span', { class: '__caret__ down' }, [caretDown]),
        index !== undefined ? [`[${index}]: ${brackets}`] : brackets,
      ]);
    };

    // 展开状态 -- 右括号
    const bracketsDownEnd = (brackets: '}' | ']', lastOne: boolean) => {
      return h(
        'div',
        { class: '__brackets2__' },
        !lastOne ? `${brackets},` : `${brackets}`,
      );
    };

    // 括号收起状态
    const bracketsRight = ({ brackets, index, lastOne, length }: BracketsRight) => {
      const type = brackets === '{}' ? 'object' : 'array';
      const [brackets1, brackets2] = brackets.split('');
      const _brackets2 = `${brackets2}${!lastOne ? ',' : ''}`;
      const node = [
        caretRight,
        length !== undefined
          ? `[length: ${length}]: ${brackets1}...${_brackets2}`
          : index !== undefined
          ? `[${index}]: ${brackets1}...${_brackets2}`
          : `${brackets1}...${_brackets2}`,
      ];
      return h('span', { class: '__caret__ right', attrs: { type } }, node);
    };

    // 返回一个函数相当于 render
    return () => {
      if (!props.data) return h('');

      const util = (
        utilLastOne: boolean,
        parentData: any,
        data: object | string | any[],
        dataIndex?: number,
      ): (VNode | string)[] => {
        // 字符串
        if (typeof data === 'string') {
          return [
            renderItem([
              h('span', { class: '__value__ string' }, `${data as string}`),
              !utilLastOne ? ',' : '',
            ]),
          ];
        }

        // 数组
        if (isArray(data)) {
          return [
            renderItem(
              (data as any).map((item: any, index: number) =>
                util(index === (data as any[]).length - 1, data, item, index),
              ),
              bracketsRight({
                brackets: '[]',
                index: dataIndex,
                lastOne: true,
                length: (data as any[]).length,
              }),
            ),
          ];
        }

        const dataKeys = Object.keys(data);
        type DataKey = keyof typeof data;

        // 对象键值对
        const renderKeyValue = ({
          key,
          value,
          lastOne,
          dataItem,
        }: RenderKeyValue): VNode => {
          const emptyObject = isObject(dataItem) && !Object.keys(dataItem).length;
          const dot = !lastOne && !isObject(dataItem) && !isArray(dataItem) && ',';
          const arrayKey =
            value.length > 1
              ? bracketsRight({
                  brackets: '{}',
                  index: dataIndex,
                  lastOne,
                })
              : '';
          const node = [
            h('span', { class: '__key__' }, key),
            ': ',
            arrayKey,
            h(
              'span',
              { class: `__value__ ${isArray(dataItem) ? 'array' : typeof dataItem}` },
              emptyObject ? [!lastOne ? emptyBrakets('{},') : emptyBrakets('{}')] : value,
            ),
            dot || '',
          ];
          return renderBlock(node);
        };

        const dataObject = data as object;

        // 对象
        return [
          !isArray(parentData)
            ? bracketsDownStart('{', isArray(parentData) ? dataIndex : undefined)
            : '',
          renderItem(
            [
              isArray(parentData)
                ? bracketsDownStart('{', isArray(parentData) ? dataIndex : undefined)
                : '',
              ...dataKeys.map((key: string, index: number) => {
                const lastOne = index === dataKeys.length - 1;
                const arrayValue =
                  isArray(dataObject[key as DataKey]) &&
                  (dataObject[key as DataKey] as any).length
                    ? [
                        bracketsRight({
                          brackets: '[]',
                          lastOne,
                          length: (dataObject[key as DataKey] as any[]).length,
                        }),
                        bracketsDownStart('['),
                        renderItem([
                          (dataObject[
                            key as DataKey
                          ] as any).map((item: any, i: number) =>
                            util(
                              index === (dataObject[key as DataKey] as any).length - 1,
                              dataObject[key as DataKey],
                              item,
                              i,
                            ),
                          ),
                          bracketsDownEnd(']', lastOne),
                        ]),
                      ]
                    : !lastOne
                    ? [emptyBrakets('[],')]
                    : [emptyBrakets('[]')];

                const objectValue = isObject(dataObject[key as DataKey])
                  ? util(lastOne, dataObject, dataObject[key as DataKey], dataIndex)
                  : !lastOne
                  ? [emptyBrakets('{},')]
                  : [emptyBrakets('{}')];
                const value = isArray(dataObject[key as DataKey])
                  ? arrayValue
                  : isObject(data[key as DataKey])
                  ? objectValue
                  : [`${data[key as DataKey]}`];
                return renderKeyValue({
                  key,
                  value,
                  lastOne,
                  dataItem: data[key as DataKey],
                });
              }),
              bracketsDownEnd('}', utilLastOne),
            ],
            bracketsRight({
              brackets: '{}',
              index: isArray(parentData) ? dataIndex : undefined,
              lastOne: utilLastOne,
            }),
          ),
        ];
      };

      // 数组
      if (isArray(props.data)) {
        return renderItem([
          h('div', '['),
          props.data.map((item: any, index: number) =>
            util(index === props.data.length, props.data, item, index),
          ),
          h('div', ']'),
        ]);
      }

      // 对象
      return renderBlock(util(true, null, props.data));
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
