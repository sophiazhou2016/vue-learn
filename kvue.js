function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    // 创建一个Observer实例
    // 每次遍历一个对象属性就创建一个Ob实例
    new Observer(obj);
}

function defineReactive(obj, key, val) {
    // 这里的val由形参变成了内部变量，一直存在缓存里面
    // console.log('初始化', val);
    observe(val); // 内部嵌套
    // 递归遍历，如果val本身是个对象
    Object.defineProperty(obj, key, {
        get() {
            console.log('get:', key, val);
            return val;
        },
        set(newVal) {
            if(val !== newVal) {
                // 如果val本身是对象，还是需要做响应式处理
                observe(newVal);
                console.log('set:', newVal);
                val = newVal;
            }
            // 更新
            // update();
        }
    });
}

function proxy(vm, prop) {
    Object.keys(vm[prop]).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm[prop][key];
            },
            set(newVal) {
                vm[prop][key] = newVal;
            }
        });
    });
}

class KVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        // 1.响应式处理
        observe(this.$data);
        // 1.1 数据的代理
        proxy(this, '$data');
        // 2.编译
    }

}

// 执行数据响应式，分辨响应式的数据是对象还是数据
class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}