<template>
  <main>
    <Header />

    <main id="home-page" class="app-wrapper">
      <div class="container">
        <div
          v-if="laudos.length == 0"
          id="home-page--no-documents"
          class="flex"
        >
          <i class="fas fa-file"></i>
          <h2>Sem laudos</h2>
          <p>Nenhum laudo foi<br />cadastrado ainda</p>
        </div>

        <div v-else id="home-page--with-documents">
          <article class="laudo-card"
            v-for="laudo in laudos" 
            :key="laudo.id" 
            @click="$router.push(`/editar-laudo/${laudo.laudoId}`)"  
          >
            <span class="laudo-card--icon">
              <i class="fas fa-file"></i>
            </span>

            <div class="laudo-card--text-wrap">
              <p class="laudo-card--contratante">{{ laudo.contratante }}</p>
              <p class="laudo-card--rua">{{ laudo.rua }}</p>
            </div>

            <span class="laudo-card--arrow">
              <i class="fas fa-chevron-right"></i>
            </span>
          </article>
        </div>
      </div>
    </main>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import service from "../services/laudo-service.js";

export default {
  name: "HomePage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      laudos: [],
    };
  },
  methods: {
    async getLaudos() {
      const usuario_id = this.$store.state.user.user.user.usuario_id;

      await service
        .browse(usuario_id)
        .then((response) => {
          this.laudos = response.data.data;
        })
        .catch((response) => {
          console.log(response);
          this.$toast.error("Algo deu errado.");
        });
    },
  },
  mounted() {
    this.getLaudos();
  },
};
</script>

<style>
#home-page--with-documents {
  overflow: auto;
  height: 140vw;
}

.laudo-card {
  background: #86c8c8;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  max-height: 67px;
  max-width: 395px;
  align-items: center;
  padding: 8px 15px;
  position: relative;
}

.laudo-card p {
  margin: unset;
}

.laudo-card--icon {
  height: 40px;
  width: 40px;
  background: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.laudo-card--arrow {
  position: absolute;
  right: 15px;
}

.laudo-card--contratante {
  font-weight: bold;
}

.laudo-card p {
  margin: unset;
}

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