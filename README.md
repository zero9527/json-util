# json-util
JSON 字符串格式化工具

## 说明
基于 `Vue2.6` + `composition-api` + `typescript`

[在线预览](https://zero9527.github.io/json-util/)


## 功能
* 格式化显示 `JSON` 字符串
* 折叠/展开 **对象/数组**
* 显示 **对象数组** 的序列号
* `key` 显示所在位置
* 样式仿 `Chrome` 控制台 `console` 样式


## 异步组件
> 在 `React` 里面对应的是 `React.lazy`+`Suspense`

对象参数如下：
* component：异步加载的**组件**
* loading：在组件加载之前，显示 loading**组件**
* error：异步组件加载错误显示的**组件**
* delay：加载延时
* timeout：加载超时时间

### 配置封装
```js
// src\components\AsyncComponent\index.ts
import { Component } from 'vue';
import Loading from './Loading.vue';
import Error from './Error.vue';

/**
 * 异步组件配置
 * 例：
 *  import AsyncComponent from '@/components/AsyncComponent/index';
    const Calendar = AsyncComponent(() =>
      import('@/components/Calendar/index.vue'),
    );
 */
const AsyncComponent = (AsyncComp: () => Promise<any>, loading?: Component) => {
  const Comp = () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    component: AsyncComp(),
    // 异步组件加载时使用的组件
    loading: loading || Loading,
    // 加载失败时使用的组件
    error: Error,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    // delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    // timeout: 3000,
  });

  return {
    render: (h: any) => h(Comp),
  };
};

export default AsyncComponent;
```

### 使用
```js
// src\App.vue
// <template>
  <div id="app">
    <div class="title">JSON-UTIL</div>
    <JSON />
  </div>
// </template>

// <script lang="ts">
import Vue from 'vue';
import AsyncComponent from '@/components/AsyncComponent';

const JSON = AsyncComponent(() => import('@/components/JSON-Util/index.vue'));

export default Vue.extend({
  name: 'App',
  components: {
    JSON,
  },
});
// </script>
```