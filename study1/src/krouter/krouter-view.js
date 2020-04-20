export default {
    render(h) {
        // 标记当前router-view的深度
        this.$vnode.data.routerView = true;

        let depth = 0;
        let parent = this.$parent;
        while(parent){
            const vnodeData = parent.$vnode && parent.$vnode.data;
            if(vnodeData && vnodeData.routerView) {
                // 说明当前的parent是一个router-view
                depth++;
            }
            parent = parent.$parent;
        }
        // 动态获取current对应的组件
        // router.component
        let {routeMap, current} = this.$router;

        // console.log('this.$router.$options.routes:', this.$router.$options.routes);
        // let component = routeMap[current].component || null;
        let component = null;
        const route = this.$router.matched[depth];
        console.log('depth:', depth);
        if(route) {
            console.log('component', route.component);
            component = route.component || null;
        }
        return h(component);
    }
}