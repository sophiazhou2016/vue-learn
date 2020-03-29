export default {
    render(h) {
        // 动态获取current对应的组件
        // router.component
        let component = null;

        // console.log('this.$router.$options.routes:', this.$router.$options.routes);
        const route = this.$router.routeMap[this.$router.current];
        if(route) {
            component = route.component;
        }
        return h(component);
    }
}