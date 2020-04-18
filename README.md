# vue原理深度剖析
## 一、kvue-router
 - 了解Vue里面的this.$options

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

 - 了解Vue的插件 使用 Vue.use()
 -  Vue的插件是一个具有install的class类
 - Vue.mixin() 的含义
 - 如何挂载 `$router :    Vue.prototype.$router`
 - Vue如何声明一个全局组件： Vue.component()
 - 设置一个响应式的属性：Vue.util.defineReactive(this, 'current', '/');
 - 掌握render函数，三个参数：标签，属性，内容
 - 默认插槽: this.$slots.default

**总结： vue-router其实就是监听hash值的变化去渲染对应的组件到router-view**



## vuex
> $store.state; commit - mutation 立即执行； dispatch - actions, getters- 派生状态； constructor里面的 get / set: 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
