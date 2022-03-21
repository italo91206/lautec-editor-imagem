<template>
  <main id="editar-laudo-locais-page">
    <header id="header">
      <section class="header-container">
        <button
          id="editar-locais-laudo-page--voltar-button"
          @click="$router.push('/')"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <h2>Editar imagens</h2>
      </section>
    </header>

    <section class="app-wrapper">
      <EditorDeImagem 
        v-if="editor_imagem_controller"
        @terminou_edicao="processaBlob"
      />
      
      <div v-else class="container">
        <img :src="image_blob" alt="" class="w100">
        
        <div class="form-group">
          <input type="text" placeholder="Nome do local" v-model="image_name">
        </div>
        
        <!-- <button @click="salvarImagem" class="button button--primary">
          Salvar imagem
        </button> -->

        <a
          :download="image_name"
          :href="image_blob[0]" 
        >
        <button @click="salvarImagem2" class="button button--primary">
            Salvar imagem
          </button>
        </a>
      </div>
      
    </section>
  </main>
</template>

<script>
import service from "../../services/laudo-service.js";
import EditorDeImagem from "@/components/EditorDeImagem.vue";

export default {
  name: "EditarLaudoLocaisPage",
  components: {
    EditorDeImagem,
  },
  data() {
    return {
      image_file: [],
      image_blob: [],
      editor_imagem_controller: true,
      image_name: 'image',
    };
  },
  methods:{
    salvarImagem2(){
      this.image_file = [];
      this.image_blob = [];
      this.editor_imagem_controller = true;
      this.image_name = 'image';
    },
    processaBlob(file){
      console.log(file);
      this.image_file.push(file);
      this.image_blob.push(URL.createObjectURL(file));
      this.editor_imagem_controller = false;
    },
    async salvarImagem(){
      const usuario_id = this.$store.state.user.user.user.usuario_id;
      const laudo_id = this.$route.params.laudo_id;

      const formData = new FormData();
      this.image_file.forEach((image) => {
        formData.append('fileimage', image);
      })
      formData.append('laudo_id', laudo_id);
      formData.append('usuario_id', usuario_id)

      // console.log(formData);
      
      await service.image_upload(formData)
        .then((response) => {
          if(response.success){
            this.$toast.success("Imagens foram salvas com sucesso!");
            // this.$router.push(`/editar-laudo/${laudo_id}`);
          }
          return response;
        })
        .catch((response) => {
          this.$toast.error("Alguma coisa deu errado.");
          console.log(response);
        })
    }
  }
};
</script>

<style>
#editar-laudo-locais-page .header-container h2 {
  margin: unset;
}

#editar-laudo-locais-page .header-container {
  justify-content: center;
  font-weight: bold;
  font-family: "Saira-Bold";
}

#editar-locais-laudo-page--voltar-button {
  position: absolute;
  left: 15px;
  border: unset;
  font-size: 22px;
  color: #464646;
  background: unset;
  border-radius: 100%;
}
</style>