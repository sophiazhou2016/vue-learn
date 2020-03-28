export default {
    props: {
        to: {
            type: String,
            required: true 
        }
    },
    render(h) {
        // 渲染结果 <a href="#/xx"></a>
        // 渲染函数的3个参数：标签名称、属性集合、子元素数组
        // 渲染函数里面的this 是实例
        // this.$slots.default : 默认插槽
        return h('a', {attrs: {href: '#' + this.to}}, [this.$slots.default]);
    }
}