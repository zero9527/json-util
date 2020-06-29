<script lang="ts">
import { VNode } from 'vue';
import { defineComponent } from '@vue/composition-api';
import { isArray, isObject } from '@/utils';

interface UtilProps {
  parentData?: any;
  data: object | string | any[];
  dataIndex?: number;
  utilLastOne: boolean; // 是否最后一个
  pos?: string; // key在JSON中的位置
}

// 对象键值对
interface RenderKeyValue {
  lastOne: boolean; // 是否最后一个
  key: string;
  dataItem: any;
  value: (VNode | string)[];
}

// 括号展开状态
interface BracketsLeft {
  showOperateIcon: boolean; // 显示加减号
  keyType: 'array-key' | 'string-key';
  index?: number;
}

// 括号收起状态
interface BracketsFold {
  lastOne: boolean; // 是否最后一个
  index?: number; // 对象在数组中的序号
  length?: number; // 数组的长度
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

    // 点击加号图标：展开
    const onUnFoldClick = (e: any) => {
      const iconFoldElem = e.target.closest('.__operate__.fold') as HTMLElement;
      const brackets1Elem = iconFoldElem.parentNode!.querySelector(
        '.__value__ .__brackets1__',
      ) as HTMLElement;
      const arrayItem = iconFoldElem.getAttribute('type') === 'array';
      const valueElem = Array.from(iconFoldElem.parentNode!.children).find(item => {
        // __value__ object 普通key的对象；__content__ 数组key的对象
        return arrayItem
          ? item.className === '__item__'
          : item.className === '__value__ object' || item.className === '__content__';
      });
      iconFoldElem.style.display = 'none';
      brackets1Elem.style.display = '';
      ctx.emit('unFoldClick', valueElem);
    };

    // 点击减号图标：收起
    const onFoldClick = (e: any) => {
      const brackets1Elem = e.target.closest('.__brackets1__');
      const arrayItem = brackets1Elem.getAttribute('type') === 'array';
      const arrayKey = brackets1Elem.getAttribute('keytype') === 'array-key';
      const valueElem = arrayItem ? brackets1Elem.nextSibling : brackets1Elem.parentNode;
      // 加号
      const iconFoldElem = arrayItem
        ? brackets1Elem.previousSibling
        : valueElem.previousSibling;

      if (!arrayKey) brackets1Elem.style.display = 'none';
      iconFoldElem.style.display = 'inline-block';
      // 隐藏 value
      ctx.emit('foldClick', valueElem);
    };

    // 加号图标：收起状态
    const iconFold = h('icon-font', {
      props: { icon: 'iconplus-square-o' },
      attrs: { title: '点击展开' },
      nativeOn: { click: onUnFoldClick },
    });

    // 减号图标：展开状态
    const iconUnfold = h('icon-font', {
      props: { icon: 'iconminus-square-o' },
      attrs: { title: '点击收起' },
      nativeOn: { click: onFoldClick },
    });

    const renderItem = (child: (VNode | string)[], bracketsFold?: VNode): VNode => {
      return h('div', { class: '__item__' }, [
        bracketsFold || '', // 收起状态
        h('div', { class: '__content__' }, child),
      ]);
    };

    const renderBlock = (child: (VNode | string)[]): VNode => {
      return h('div', { class: '__block__' }, child);
    };

    // 空对象、空数组
    const emptyBrakets = (brackets: '{}' | '{},' | '[]' | '[],'): VNode => {
      return h('span', { class: '__brackets1__ __brackets2__' }, brackets);
    };

    // 引号
    const valueWithQuote = (value: any): VNode[] => {
      const quote = h('span', { class: '__quote__' }, '"');
      return [quote, value, quote];
    };

    // 展开状态 -- 左括号
    const bracketsLeft = (
      brackets: '{' | '[',
      { showOperateIcon, index, keyType }: BracketsLeft,
    ): VNode => {
      const type = brackets === '{' ? 'object' : 'array';
      return h('span', { class: '__brackets1__', attrs: { type, keyType } }, [
        showOperateIcon ? h('span', { class: '__operate__ unfold' }, [iconUnfold]) : '',
        h('span', index !== undefined ? [`[${index}]: ${brackets}`] : brackets),
      ]);
    };

    // 展开状态 -- 右括号
    const bracketsRight = (brackets: '}' | ']', lastOne: boolean): VNode => {
      return h(
        'div',
        { class: '__brackets2__' },
        !lastOne ? `${brackets},` : `${brackets}`,
      );
    };

    // 括号收起状态
    const bracketsFold = (
      brackets: '{}' | '[]',
      { index, lastOne, length }: BracketsFold,
    ): VNode => {
      const type = brackets === '{}' ? 'object' : 'array';
      const [brackets1, brackets2] = brackets.split('');
      const _brackets2 = `${brackets2}${!lastOne ? ',' : ''}`;
      const node = [
        iconFold,
        h(
          'span',
          length !== undefined
            ? `[length: ${length}]: ${brackets1}...${_brackets2}`
            : index !== undefined
            ? `[${index}]: ${brackets1}...${_brackets2}`
            : `${brackets1}...${_brackets2}`,
        ),
      ];
      return h('span', { class: '__operate__ fold', attrs: { type } }, node);
    };

    // 统一处理逻辑
    const util = ({
      parentData,
      data,
      dataIndex,
      utilLastOne,
      pos,
    }: UtilProps): (VNode | string)[] => {
      // 字符串
      if (typeof data === 'string') {
        return [
          renderItem([
            h('span', { class: '__value__ string' }, [valueWithQuote(data as string)]),
            !utilLastOne ? ',' : '',
          ]),
        ];
      }

      // 数组
      if (isArray(data)) {
        return [
          renderItem(
            (data as any).map((item: any, index: number) =>
              util({
                parentData: data,
                data: item,
                dataIndex: index,
                utilLastOne: index === (data as any[]).length - 1,
                pos: `${pos}[${index}]`,
              }),
            ),
            bracketsFold('[]', {
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
        // 空对象
        const emptyObject = isObject(dataItem) && !Object.keys(dataItem).length;
        // 逗号
        const comma = !lastOne && !isObject(dataItem) && !isArray(dataItem) && ',';
        const arrayKey = value.length > 1 ? bracketsFold('{}', { lastOne }) : '';
        const stringValue = typeof dataItem === 'string' && valueWithQuote(value);
        const node = [
          h('span', { class: '__key__', attrs: { title: `${pos}.${key}` } }, [
            valueWithQuote(key),
          ]),
          ': ',
          arrayKey,
          h(
            'span',
            { class: `__value__ ${isArray(dataItem) ? 'array' : typeof dataItem}` },
            emptyObject
              ? [!lastOne ? emptyBrakets('{},') : emptyBrakets('{}')]
              : [stringValue || value],
          ),
          comma || '',
        ];
        return renderBlock(node);
      };

      const dataObject = data as object;

      // 对象
      return [
        !isArray(parentData)
          ? bracketsLeft('{', {
              showOperateIcon: !!parentData,
              keyType: 'string-key',
            })
          : '',
        renderItem(
          [
            isArray(parentData)
              ? bracketsLeft('{', {
                  showOperateIcon: !!parentData,
                  keyType: 'array-key',
                  index: dataIndex,
                })
              : '',
            ...dataKeys.map((key: string, index: number) => {
              const lastOne = index === dataKeys.length - 1;
              const arrayValue =
                isArray(dataObject[key as DataKey]) &&
                (dataObject[key as DataKey] as any).length
                  ? [
                      bracketsFold('[]', {
                        lastOne,
                        length: (dataObject[key as DataKey] as any[]).length,
                      }),
                      bracketsLeft('[', {
                        showOperateIcon: !!(dataObject[key as DataKey] as any),
                        keyType: isArray(dataObject) ? 'array-key' : 'string-key',
                      }),
                      renderItem([
                        (dataObject[key as DataKey] as any).map((item: any, i: number) =>
                          util({
                            parentData: dataObject[key as DataKey],
                            data: item,
                            dataIndex: i,
                            utilLastOne:
                              i === (dataObject[key as DataKey] as any[]).length - 1,
                            pos: `${pos}.${key}[${i}]`,
                          }),
                        ),
                        bracketsRight(']', lastOne),
                      ]),
                    ]
                  : !lastOne
                  ? [emptyBrakets('[],')]
                  : [emptyBrakets('[]')];

              const objectValue = isObject(dataObject[key as DataKey])
                ? util({
                    parentData: dataObject,
                    data: dataObject[key as DataKey],
                    dataIndex,
                    utilLastOne: lastOne,
                    pos: `${pos}.${key}`,
                  })
                : [''];
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
            bracketsRight('}', utilLastOne),
          ],
          bracketsFold('{}', {
            index: isArray(parentData) ? dataIndex : undefined,
            lastOne: utilLastOne,
          }),
        ),
      ];
    };

    // 返回一个函数相当于 render
    return () => {
      if (!props.data) return h('');

      // 数组
      if (isArray(props.data)) {
        return renderItem([
          h('div', { class: '__brackets1__' }, '['),
          props.data.map((item: any, index: number) =>
            util({
              parentData: props.data,
              data: item,
              dataIndex: index,
              utilLastOne: index === props.data.length,
              pos: `[][${index}]`,
            }),
          ),
          h('div', { class: '__brackets2__' }, ']'),
        ]);
      }

      // 对象
      return renderBlock(util({ data: props.data, utilLastOne: true, pos: '{}' }));
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
