// Dep : 管理watcher
class Dep {
    constructor() {
        this.watchers = [];
    }
    addDep(watcher) {
        this.watchers.push(watcher);
    }
    notify() {
        this.watchers.forEach(watcher => {
            watcher.update();
        });
    }
}
const dep = new Dep();

// 数组响应式
// 1. 替换数组原型中的7个方法
const originalProto = Array.prototype;
// 备份一份，修改备份
const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift'].forEach(method => {
    arrayProto[method] = function() {
        // 原始操作
        originalProto[method].apply(this, arguments);
        // 覆盖操作：通知更新
        console.log('数组执行 ' + method + ': 操作');
        observe(this);
        dep.notify();
    };
});

function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    
    // 创建一个Observer实例
    // 每次遍历一个对象属性就创建一个Ob实例
    new Observer(obj);
}



// 对象响应式
function defineReactive(obj, key, val) {
    // 这里的val由形参变成了内部变量，一直存在缓存里面
    // console.log('初始化', val);
    observe(val); // 内部嵌套

    // 创建Dep实例和key 一一对应
    // const dep = new Dep();
    // 递归遍历，如果val本身是个对象
    Object.defineProperty(obj, key, {
        get() {
            // console.log('get:', key, val);
            // 依赖收集
            Dep.target && dep.addDep(Dep.target);
            return val;
        },
        set(newVal) {
            // debugger
            if(val !== newVal) {
                // 如果val本身是对象，还是需要做响应式处理
                observe(newVal);
                console.log('set:', newVal);
                val = newVal;

                // 更新
                // watchers.forEach(w => {
                //     w.update();
                // });
                dep.notify();
            }
            // 更新
            // update();
        }
    });
}

// 代理
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
        new Compile(this.$options.el, this);
    }

    set(obj, key, val) {
        defineReactive(obj, key, val);
    }
}

// 执行数据响应式，分辨响应式的数据是对象还是数据
class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }
    walk(obj) {
        // 判断obj类型
        if (Array.isArray(obj)) {
            // 覆盖原型，替换7个方法
            obj.__proto__ = arrayProto;
            // 对数组内部的元素执行响应化
            const keys = Object.keys(obj);
            for(let i = 0; i < keys.length; i++){
                defineReactive(obj, i, obj[i]);
            }
        } else {
            Object.keys(obj).forEach(key => {
                defineReactive(obj, key, obj[key]);
            });
        }
    }
}
// const watchers = [];

// // Dep : 管理watcher
// class Dep {
//     constructor() {
//         this.watchers = [];
//     }
//     addDep(watcher) {
//         this.watchers.push(watcher);
//     }
//     notify() {
//         this.watchers.forEach(watcher => {
//             watcher.update();
//         });
//     }
// }

// Watcher: 和模板中的依赖1对1对应，如果某个key发生变化，则执行更新函数
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm;
        this.key = key;
        this.updateFn = updateFn;
        
        // watchers.push(this);
        // 和Dep建立关系
        Dep.target = this;
        this.vm[this.key] // 触发get,可以做依赖收集
        Dep.target = null;
    }
    // 更新方法是让Dep调用的
    update() {
        this.updateFn.call(this.vm, this.vm[this.key]);
    }
}

// 编译器 解析模板中插值表达式或者指令
class Compile {
    // vm 是KVue的实例，用于初始化，更新数据
    // el 一个选择器以获取dom模板
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);

        this.compile(this.$el);
    }
    compile(el) {
        const childNodes = el.childNodes;

        // 遍历所有子节点
        Array.from(childNodes).forEach(node => {
            // 元素类型
            if(this.isElement(node)) {
                console.log('编译元素', node.nodeName);
                this.compileElement(node);
            } else if(this.isInter(node)) {
                console.log('编译插值', node.textContent);
                this.compileText(node);
            }

            // 递归
            if (node.childNodes) {
                this.compile(node);
            }
        });
    }
    isElement(node) {
        return node.nodeType === 1;
    }
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    // 更新方法
    update(node, exp, dir) {
        // 找到实操函数
        const fn = this[dir + 'Updater'];
        // 初始化
        fn && fn(node, this.$vm[exp]);
        // 更新
        new Watcher(this.$vm, exp, function(val) {
            // console.log('update:', val);
            // 这里的val 就是 this.$vm[exp]
            fn && fn(node, val);
        });
    }

    textUpdater(node, val) {
        // 具体操作
        node.textContent = val;
        // this.update(node, );
    }

    // 编译插值文本，初始化
    compileText(node) {
        // node.textContent = this.$vm[RegExp.$1];
        this.update(node, RegExp.$1, 'text');
    }

    // 编译元素节点,判断属性是否是 k-xx  @xx
    compileElement(node) {
        // 获取属性
        let nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            // attr对象 {name: 'k-text', value: 'counter' }
            let attrName = attr.name;
            let exp = attr.value;
            if(this.isDir(attrName)) {
                // 获取指令的处理的函数并执行
                let dir = attrName.substring(2); // text
                this[dir] && this[dir](node, exp);
            }
        });
    }

    isDir(attr) {
        return attr.indexOf('k-') === 0;
    }

    // k-text 执行执行
    text(node, exp) {
        // node.textContent = this.$vm[exp];
        this.update(node, exp, 'text');
    }

    // k-html 指令执行
    html(node, exp) {
        // node.innerHTML = this.$vm[exp];
        this.update(node, exp, 'html');
    }

    htmlUpdater(node, val) {
        node.innerHTML = val;
    }
    
    // k-model 指令执行
}

