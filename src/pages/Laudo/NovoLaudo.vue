<template>
  <main id="novo-laudo-page">
    <header id="header">
      <section class="header-container">
        <button @click="$router.push('/')" id="novo-laudo-page--voltar-button">
          <i class="fas fa-chevron-left"></i>
        </button>

        <h2>Cadastrar Laudo</h2>
      </section>
    </header>

    <section class="app-wrapper">
      <div class="container">
        <div class="form-group">
          <label for="">Contratante</label>
          <input type="text" placeholder="Digite o nome do contratante" v-model="contratante" />
        </div>

        <div class="form-group">
          <label for="">Condomínio/Rua</label>
          <input type="text" placeholder="Digite o nome da rua/condomínio" v-model="rua" />
        </div>

        <div class="form-group">
          <label for="">Nome da edificação</label>
          <input type="text" placeholder="Digite o nome da edificação" v-model="nome_edificio" />
        </div>
      </div>
    </section>

    <footer id="footer">
      <section class="footer--container">
        <button class="button button--secondary" @click="$router.push('/')">
          Cancelar
        </button>

        <button class="button button--primary" @click="create">Criar</button>
      </section>
    </footer>
  </main>
</template>

<script>
import service from "../../services/laudo-service.js";

export default {
  name: "NovoLaudoPage",
  data(){
    return {
      contratante: '',
      rua: '',
      nome_edificio: '',
    }
  },
  methods: {
    async create(){
      const { contratante, rua, nome_edificio } = this;
      const usuario_id = this.$store.state.user.user.user.usuario_id

      if(contratante == '' || rua == '' || nome_edificio == '')
        this.$toast.error('Os campos precisam estar preenchidos');
      else{
        await service
          .create(contratante, rua, nome_edificio, usuario_id)
          .then((response) => {
            let laudo = response.data.data;
            localStorage.setItem("laudoRecentlyCreated", laudo);
            this.$router.push('/novo-laudo-sucesso')
          })
          .catch((response) => {
            console.log(response)
            this.$toast.error("Algo deu errado.");
          })
      }
    }
  }
};
</script>

<style>
#novo-laudo-page--voltar-button {
  position: absolute;
  left: 15px;
  border: unset;
  font-size: 22px;
  color: #464646;
  background: unset;
  border-radius: 100%;
}

#novo-laudo-page .header-container {
  justify-content: center;
  font-weight: bold;
  font-family: "Saira-Bold";
}

#novo-laudo-page .header-container h2 {
  margin: unset;
}

#novo-laudo-page #footer .button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: "Saira-Regular";
  width: 42%;
  max-width: 170px;
}
</style>