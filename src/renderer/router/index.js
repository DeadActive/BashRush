import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Pop',
            component: require('@/components/TrayPop').default,
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
})
