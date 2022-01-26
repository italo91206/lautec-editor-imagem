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

  if(user == null){
    if(to.path == '/login')
      next();
    else
      next({ path: '/login' })
  }
  else {
    let user_decoded = jwt_decode(user);
    let exp_date = new Date(user_decoded.exp * 1000);
    // console.log(`Expira em: ${exp_date}`)
    // console.log(`Hoje é: ${new Date()}`);
    
    if(exp_date < new Date()){
      // console.log('Este token está expirado');
      localStorage.removeItem('user');
      next({ path: '/login' });
    }
    else{
      // console.log('Este token ainda é válido');
      // console.log('exp_date é maior que hoje');
      store.commit("user/setUser", user_decoded);
      next();
    }

  }
})

new Vue({
  router,
  store,
  VueToast,
  render: h => h(App),
}).$mount('#app')
