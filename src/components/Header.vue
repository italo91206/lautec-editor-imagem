<template>
  <header id="header">
    <section class="header-container">
      <img src="imgs/lautec-header-logo.png" alt="" />

      <button class="header--menu-button">
        <i class="fas fa-cog"></i>
      </button>
    </section>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style>
#header {
  background: linear-gradient(0deg, #ffffff, #ffffff);
  box-shadow: 0px 2px 12px rgb(0 0 0 / 12%);
  padding: 20px 18px;
}
.header--menu-button {
  background: #059696;
  border: unset;
  border-radius: 100%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>