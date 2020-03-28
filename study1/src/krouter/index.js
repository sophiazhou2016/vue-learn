// 实现KVueRooter类
// 1. 路由：实现监听url
// 2. 两个组件：router-link、router-view
import Vue from 'vue';
import Link from './krouter-link';
import View from './krouter-view';

class KVueRouter {
    constructor(options) {
        this.$options = options;

        // 设置一个响应式的 current 属性
        Vue.util.defineReactive(this, 'current', '/');

        // 事件监听
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        window.addEventListener('load', this.onHashChange.bind(this));
    }

    onHashChange() {
        // #/about
        this.current = window.location.hash.slice(1)
        console.log('onHashChange:', this.current);
        // 界面动态响应Url变化（响应式）
    }
}



KVueRouter.install = function(_Vue) {
    let Vue = _Vue;

    Vue.mixin({
        // 挂载$router
        // 怎么找到实例
        // Vue 里面的 $options 可以获取组件的data之外的所有属性
        beforeCreate() { // 会被执行很多次，每个组件创建都会执行
            if(this.$options.router) { // 只有根组件才有router，所以if只会被执行一次
                Vue.prototype.$router = this.$options.router;
            }
        }
    });

    // 声明两个全局组件,Vue创建全局组件的方法：Vue.component('name', component)
    Vue.component('router-link', Link);
    Vue.component('router-view', View);
};

export default KVueRouter;