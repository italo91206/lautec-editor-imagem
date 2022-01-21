<template>
  <footer id="footer">
    <section class="footer--container">
      <button class="footer-button">
        <i class="fas fa-file"></i>
        <p>Laudos</p>
      </button>

      <button class="footer-button" @click="$router.push('/novo-laudo')">
        <i class="fas fa-file-medical"></i>
        <p>Criar laudo</p>
      </button>

      <button class="footer-button">
        <i class="fas fa-pencil-alt"></i>
        <p>Continuar</p>
      </button>
    </section>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
#footer {
  background: linear-gradient(0deg, #ffffff, #ffffff);
  box-shadow: 0px 2px 12px rgb(0 0 0 / 12%);
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.footer--container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px;
}

.footer-button {
  border: unset;
  background: unset;
  color: #059696;
  font-size: 12px;
  font-weight: bold;
}

.footer-button i {
  font-size: 20px;
}
</style>