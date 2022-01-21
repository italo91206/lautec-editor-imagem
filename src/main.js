import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import jwt_decode from 'jwt-decode'

import routes from './routes.js'
import store from './store';

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueToast);
Vue.use(Vuex);

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  let user = localStorage.getItem('user');

  if(to.path == '/login'){
    next();
  }
  else if(user == null){
    next({ path: '/login' })
  }
  else {
    user = jwt_decode(user);
    store.commit("user/setUser", user);
    //console.log(user);
    next();
  }
})

new Vue({
  router,
  store,
  VueToast,
  render: h => h(App),
}).$mount('#app')
