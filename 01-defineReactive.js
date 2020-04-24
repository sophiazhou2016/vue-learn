function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log('get:', key, val);
            return val;
        },
        set(newVal) {
            if(val !== newVal) {
                console.log('set:', newVal);
                val = newVal;
            }
        }
    });
}

let obj = {

};

defineReactive(obj, 'foo');

obj.foo;
obj.foo = 'fooooo111';

obj.foo;
obj.foo = 'fooooo222';

