<template>
  <main id="editar-laudo-page">
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
        <div class="laudo-text--wrapper">
          <h2>{{ laudo.contratante }}</h2>
          <h4>{{ laudo.rua }}</h4>
        </div>

        <button class="square-button square-button--primary disabled">
          Adicionar informações complementares
        </button>

        <button class="square-button square-button--primary"
          @click="$router.push(`/editar-laudo/locais/${laudo.laudo_id}`)"  
        >
          Adicionar fotos/locais
        </button>

        <button class="square-button square-button--primary disabled">
          Adicionar itens de sumário
        </button>

        <button class="square-button square-button--primary alert">
          Excluir laudo
        </button>

        <button
          class="square-button square-button--secondary"
          @click="$router.push('/')"
        >
          Voltar ao início
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import service from "../../services/laudo-service.js";

export default {
  name: "EditarLaudoPage",
  data() {
    return {
      laudo: {},
    };
  },
  methods: {
    async getLaudo() {
      const usuario_id = this.$store.state.user.user.user.usuario_id;
      const laudo_id = this.$route.params.laudo_id;

      await service
        .get(laudo_id, usuario_id)
        .then((response) => {
          this.laudo = response.data.data;
        })
        .catch((response) => {
          console.log(response);
          this.$toast.error("Algo deu errado");
        });
    },
  },
  mounted() {
    this.getLaudo();
  },
};
</script>

<style>
#editar-laudo-page .header-container {
  justify-content: center;
  font-weight: bold;
  font-family: "Saira-Bold";
}

#editar-laudo-page .container h2 {
  font-size: 18px;
  margin-top: 164px;
  margin-bottom: 0px;
  text-align: center;
}

#editar-laudo-page .container h4 {
  text-align: center;
  margin-top: 0px;
  font-weight: unset;
  margin-bottom: 30px;
}

#editar-laudo-page .header-container h2 {
  margin: unset;
}
</style>