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
**总结： vue-router其实就是监听hash值的变化去渲染对应的组件到router-view**




## vuex
> $store.state; commit - mutation 立即执行； dispatch - actions, getters- 派生状态； constructor里面的 get / set: 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
