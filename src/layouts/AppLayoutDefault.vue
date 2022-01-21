<template>
  <main>
    <main id="app--main">
      <slot />
    </main>
  </main>
</template>

<script>
// import Header from "@/components/Header.vue";
// import Footer from "@/components/Footer.vue";

export default {
  name: "AppLayoutDefault",
  // components: {
  //   Header,
  //   Footer,
  // },
};
</script>

<style>
#app--main {
  height: 100%;
  overflow: auto;
}
</style>