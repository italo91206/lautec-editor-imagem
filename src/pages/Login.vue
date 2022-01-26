<template>
  <main id="login-page">
    <section id="login--header">
      <h2>Lautech</h2>
    </section>

    <section class="container">
      <div>
        <h2>Login</h2>
        <p>Faça o login para continuar</p>
      </div>

      <div class="form-group">
        <label for="">E-mail</label>
        <input type="text" placeholder="Digite o e-mail" v-model="email" />
      </div>

      <div class="form-group">
        <label for="">Senha</label>
        <input type="text" placeholder="Digite a senha" v-model="senha" />
      </div>

      <div class="form-group form-group--checkbox">
        <input type="checkbox" v-model="remember_me" />
        <label for="">Lembre-me</label>
      </div>

      <div class="form-group">
        <button class="button button--primary" @click="login" :class="{'loading': login_loading}">
          <template v-if="!login_loading">Login</template>
          <template v-else>Aguarde...</template>
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import service from "../services/user-service.js";
import jwt_decode from 'jwt-decode';

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      senha: "",
      remember_me: "",
      login_loading: false,
    };
  },
  methods: {
    async login() {
      let { email, senha } = this;
      this.login_loading = true;
      await service
        .login(email, senha)
        .then((response) => {
          this.login_loading = false;
          
          if(response.data.success){
            let token = response.data.user;
            let decoded; 
            // token = token.token;
            
            try{
              decoded = jwt_decode(token.token);
            }
            catch(err){
              console.log(err);
            }

            // console.log(decoded.user);
            console.log(token);

            localStorage.setItem("user", token.token);
            this.$store.dispatch("user/setUser", decoded.user);
            let nome = this.$store.state.user.user.nome;
            this.$router.push("/");
            this.$toast.success(`Bem vindo de volta ${nome}`);
          }
          else
            this.$toast.error(response.message)
        })
        .catch((response) => {
          console.log(response);
          this.$toast.error(response.message);
        });
    },
  },
};
</script>

<style>
#login--header {
  height: 122px;
  background: linear-gradient(95.8deg, #242865 0.38%, #059696 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

#login--header h2 {
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 35px;
}
#login-page .form-group--checkbox {
  color: #8f95af;
  font-weight: unset;
}
#login-page .form-group--checkbox label {
  font-weight: 400;
}
</style>