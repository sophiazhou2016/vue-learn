// 1. 实现一个插件：实现Store类，挂载$store
// 引用Vue的构造函数
let Vue;

class Store {
    constructor(options = {}) {
        // this.$options = options;
        

        // 保存mutatios
        this._mutations = options.mutations;
        this._actions = options.actions;

        this._wrappedGetters = options.getters;
        
        // 定义computed选项
        const computed = {};
        this.getters = {};
        // (doubleCounter(state) {})
        const store = this;
        Object.keys(this._wrappedGetters).forEach(key => {
            // 获取用户定义的getter
            const fn = store._wrappedGetters[key];
            // 转换为 computed 可以使用的无参数形式
            computed[key] = function() {
                return fn(store.state);
            };
            // 为getters 定义只读属性
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        });
        // 只要放到data上，即成为响应式的
        this._vm = new Vue({
            data: {
                $$state: options.state
            },
            computed
        });
        // 绑定commit、dispatch方法中的this到Store实例上
        // const store = this;
        const {commit, dispatch} = store;
        // this.commit = function boundCommit(type, payload) {
        this.commit = function boundCommit(type, payload) {
            commit.call(store, type, payload);
        };
        this.dispatch = function boundDispatch(type, payload) {
            return dispatch.call(store, type, payload);
        };
    }

    // 只读属性state
    get state() {
        console.log('get state');
        return this._vm._data.$$state;
    }

    set state(v) {
        console.error('不要改，这里不能修改，想改请使用replaceState()');
    }

    // commit: type - mutation的类型，payload参数
    commit(type, payload) {
        const entry = this._mutations[type];
        if(!entry) {
            console.error('unknown muatation type:' + type);
            return;
        }
        // 在这可以做一些拦截处理

        // 传递state进去
        return entry(this.state, payload);
    }

    // dispatch: type - actions 的类型
    dispatch(type, payload) {
        const entry = this._actions[type];
        if(!entry) {
            console.error('unknown muatation type:' + type);
            return;
        }
        // 在这可以做一些拦截处理

        // 传递上下文，
        entry(this, payload);
    }
}

function install(_Vue) {
    Vue = _Vue;
    // 全局混入
    Vue.mixin({
        beforeCreate() {
            // console.log('this.$options:', this.$options);
            if(this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    })
}

// 下面导出的对象等同于vuex,实例化时使用 new Vuex().Store
export default {
    Store,
    install
};