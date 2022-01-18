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
        <button class="button button--primary" @click="login">Login</button>
      </div>
    </section>
  </main>
</template>

<script>
import service from "../services/user-service.js";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      senha: "",
      remember_me: "",
    };
  },
  methods: {
    async login() {
      let { email, senha } = this;

      await service
        .login(email, senha)
        .then((response) => {
          let token = response.data.token;
          localStorage.setItem("user", token);
          this.$store.dispatch("user/setUser", token);
          this.$router.push("/");
          this.$toast.success(
            `Bem vindo de volta ${this.$store.state.user.user.user.email}`
          );
        })
        .catch((response) => {
          console.log(response);
          this.$toast.error("Algo deu errado.");
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