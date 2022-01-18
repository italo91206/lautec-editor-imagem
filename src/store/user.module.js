import jwt_decode from "jwt-decode";

// const existent_user = localStorage.getItem('user');

export const user = {
  namespaced: true,
  state: {
    user: {},
  },
  actions: {
    setUser({commit}, token){
      let user = jwt_decode(token);
      return commit('setUser', user);
    },
    getUser({commit}){
      return commit('getUser');
    }
  },
  mutations: {
    loginFailue(state){
      state.user = null;
    },
    loginSuccess(state, data){
      let user = data;
      state.user = user;
    },
    setUser(state, user){
      state.user = user;
    },
    getUser(state){
      return state.user;
    }

  }
}