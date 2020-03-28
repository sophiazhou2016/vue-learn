export default {
    render(h) {
        // 动态获取current对应的组件
        // router.component
        let component = null;

        console.log('this.$router.$options.routes:', this.$router.$options.routes);
        this.$router.$options.routes.forEach(route => {
            console.log(route.path, this);
            if(route.path === this.$router.current) {
                component = route.component;

                // return h(component);
            }
        });

        return h(component);
    }
}