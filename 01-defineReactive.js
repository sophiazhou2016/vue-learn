 // 对象响应化：遍历每个key, 定义getter、setter
 function observe(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key]);
    });
}

function defineReactive(obj, key, val) {
    // 这里的val由形参变成了内部变量，一直存在缓存里面
    console.log('初始化', val);
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

function set(obj, key, val) {
    defineReactive(obj, key, val);
}

// 更新
function update() {
    app.innerText = obj.foo;
}

let obj = {
    foo: 'foo',
    bar: 'bar',
    baz: {
        a: 1
    }
};
observe(obj);
// defineReactive(obj, 'foo', '');

obj.foo;
// obj.foo = new Date().toLocaleTimeString();
// obj.foo = 'fooooooo';
// obj.bar;
// obj.bar = 'barrrrrr';
obj.baz.a = 10;
obj.baz = {a: 1};
obj.baz.a = 100;
// 新加属性
// obj.dong = 'dong';
// obj.dong;
set(obj, 'dong', 'dong');
obj.dong;

// setInterval(() => {
//     obj.foo = new Date().toLocaleTimeString();
// }, 1000);