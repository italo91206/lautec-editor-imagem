<template>
  <main id="novo-laudo-sucesso-page">
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
        <h2>Laudo cadastrado com sucesso !</h2>

        <button class="square-button square-button--primary disabled">
          Adicionar informações complementares
        </button>

        <button class="square-button square-button--primary">
          Adicionar fotos/locais
        </button>

        <button class="square-button square-button--primary disabled">
          Adicionar itens de sumário
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
export default {
  name: "LaudoAfterPage",
};
</script>

<style>
#novo-laudo-sucesso-page .header-container {
  justify-content: center;
  font-weight: bold;
  font-family: "Saira-Bold";
}

#novo-laudo-sucesso-page .container h2 {
  font-size: 18px;
  margin-top: 164px;
  margin-bottom: 30px;
  text-align: center;
}

#novo-laudo-sucesso-page .header-container h2 {
  margin: unset;
}
</style>