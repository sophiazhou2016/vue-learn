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
 - 安装 Vue.js 插件： `Vue.use(component);` 表示全局引用了这个插件。
 - 如果插件是一个对象，必须提供 install 方法。
 - 如果插件是一个函数，它会被作为 install 方法。
 - install 方法调用时，会将 Vue 作为参数传入。
 - 该方法需要在调用 new Vue() 之前被调用。
 
### 3.Vue.mixin() 的含义
 - 如何挂载 `$router :    Vue.prototype.$router`
 - Vue如何声明一个全局组件： Vue.component()
 - 设置一个响应式的属性：Vue.util.defineReactive(this, 'current', '/');
 - 掌握render函数，三个参数：标签，属性，内容
 - 默认插槽: this.$slots.default

**总结： vue-router其实就是监听hash值的变化去渲染对应的组件到router-view**





## vuex
> $store.state; commit - mutation 立即执行； dispatch - actions, getters- 派生状态； constructor里面的 get / set: 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
