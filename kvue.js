function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    // 创建一个Observer实例
    // 每次遍历一个对象属性就创建一个Ob实例
    new Observer(obj);
}

// 定义响应式
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

    // 编译插值文本，初始化
    compileText(node) {
        node.textContent = this.$vm[RegExp.$1];
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
        node.textContent = this.$vm[exp];
    }
}
