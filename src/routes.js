import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'
import NovoLaudo from '@/pages/Laudo/NovoLaudo.vue'
import LaudoAfter from '@/pages/Laudo/LaudoAfter.vue'
import EditarLaudo from '@/pages/Laudo/EditarLaudo.vue'
import EditarLaudoLocais from '@/pages/Laudo/EditarLaudoLocais.vue'

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
    },
    {
        path: "/novo-laudo",
        component: NovoLaudo,
        meta: {
            title: "Cadastrar novo laudo",
            layout: "AppLayoutDefault"
        }
    },
    {
        path: "/novo-laudo-sucesso",
        component: LaudoAfter,
        meta: {
            title: "Laudo criado com sucesso",
            layout: "AppLayoutDefault"
        }
    },
    {
        path: "/editar-laudo/:laudo_id",
        component: EditarLaudo,
        meta: {
            title: "Laudo criado com sucesso",
            layout: "AppLayoutDefault"
        }
    },
    {
        path: "/editar-laudo/locais/:laudo_id",
        component: EditarLaudoLocais,
        meta: {
            title: "Laudo criado com sucesso",
            layout: "AppLayoutDefault"
        }
    }
]

export default routes;