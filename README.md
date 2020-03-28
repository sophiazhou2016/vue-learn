# vue-learn
vue原理深度剖析

## kvue-router
> 了解Vue里面的this.$options
> 了解Vue的插件 使用 Vue.use()
> Vue的插件是一个具有install的class类
> Vue.mixin() 的含义
> 如何挂载$router : Vue.prototype.$router
> Vue如何声明一个全局组件： Vue.component()
> 设置一个响应式的属性：Vue.util.defineReactive(this, 'current', '/');
> 掌握render函数，三个参数：标签，属性，内容
> 默认插槽: this.$slots.default
> 总结： vue其实就是监听hash值的变化去渲染对应的组件到router-view