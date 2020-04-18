# vue原理深度剖析
## 一、自己实现一个`router`组件：kvue-router
### 1. 了解Vue里面的`this.$options`

> 用于当前 Vue 实例的初始化选项
```javascript
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // => 'foo'
  }
})
```
> 或者如下，可以用 `this.$options.router` 获取`Vue`实例下面的`router`对象

```javascript
const mainApp = new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
});
```

### 2. 了解Vue的插件
 - 安装 Vue.js 插件： `Vue.use(component);` 。
 - 如果插件是一个对象，必须提供 install 方法。
 - 如果插件是一个函数，它会被作为 install 方法。
 - install 方法调用时，会将 Vue 作为参数传入。
 - 该方法需要在调用 new Vue() 之前被调用。
 
### 3.Vue.mixin() 的含义
> 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。

```javascript
Vue.mixin({
        // 挂载$router
        // Vue 里面的 $options 可以获取组件的data之外的所有属性
        beforeCreate() { // 会被执行很多次，每个组件创建都会执行
            if(this.$options.router) { // 只有根组件才有router，所以if只会被执行一次
                Vue.prototype.$router = this.$options.router;
            }
        }
    });
```

### 4.如何挂载 `$router :    Vue.prototype.$router`
### 5.设置一个响应式的属性：`Vue.util.defineReactive(this, 'current', '/');`
### 6.掌握render函数，三个参数：标签，属性，内容
### 7.默认插槽: this.$slots.default
### 8.嵌套路由：层级深度(n)，当前的数组[n]
**总结： vue-router其实就是监听hash值的变化去渲染对应的组件到router-view** ，具体的参见代码 krouter

##  二、自己实现vuex
### 1、Vuex的基本概念 
#### *state:*
> `this.$store.state`。通过全局注册到根实例该 store 实例会注入到根组件下的所有子组件中，且子组件能通过
> `this.$store` 访问到。

```javascript
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件。
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```
#### *getter*
> 可以认为是 `store` 的计算属性.Getter 接受 state 作为其第一个参数：

```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

> 我们可以很容易地在任何组件中使用它：

```javascript
this.$store.getters.doneTodosCount
```
#### *mutation*
> 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
```javascript
mutations: {
        add(state) {
            // state怎么来的
            state.count ++;
        }
},
```
可以这样调用 mutations 里面的方法：

```javascript
this.$store.commit('add')
```
#### *action*
> 类似muatation，Action 提交的是 mutation，而不是直接变更状态。Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

```javascript
actions: {
    increment (context) {
      context.commit('increment')
    }
  }
```

> 实践中，我们会经常用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 commit 很多次的时候）：
```javascript
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```
> Action 通过 store.dispatch 方法触发：

```javascript
store.dispatch('increment')
```
> 与mutations 的差别：mutations 必须是同步的，actions 可以是异步或者同步：

```javascript
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```
#### *modules*

$store.state; commit - mutation 立即执行； dispatch - actions, getters- 派生状态； constructor里面的 get / set: 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
