import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'

const routes = [
    {
        path: "/login",
        component: Login,
        meta: {
            title: "Página de login",
        }
    },
    {
        path: "/",
        component: Home,
        meta: {
            title: "Página home",
            layout: "AppLayoutDefault"
        }
    }
]

export default routes;