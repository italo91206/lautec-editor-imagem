<template>
  <main id="home-page" class="app-wrapper">
    <div class="container">
      <div id="home-page--no-documents" class="flex">
        <i class="fas fa-file"></i>
        <h2>Sem laudos</h2>
        <p>Nenhum laudo foi<br />cadastrado ainda</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style>
#home-page--no-documents {
  padding: 32px;
  color: #d8d8d9;
  text-align: center;
}

#home-page--no-documents h2 {
  font-size: 27px;
  font-weight: bold;
  margin: unset;
  margin-bottom: 4px;
}

#home-page--no-documents p {
  margin: unset;
  font-size: 16px;
}

#home-page--no-documents i {
  font-size: 75px;
  margin-bottom: 8px;
}
</style>