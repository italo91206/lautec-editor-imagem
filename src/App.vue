<template>
  <div id="app">
    <div class="form-group">
      <label>Capturar imagem</label>
      <input type="file" accept="image/*" capture @input="imagemInput">
    </div>

    <div class="form-group">
      <label for="">Abrir galeria</label>
      <input type="file" accept="image/*" @input="imagemInput">
    </div>

    <div id="konva-stage"></div>
  </div>
</template>

<script>
import Konva from 'konva';

export default {
  name: 'App',
  data(){
    return {
      data: null,
      image_url: null,
      stage: null,
      layer: null,
    }
  },
  methods: {
    imagemAdicionada(){
      let stage = this.stage;
      stage.on('click', function(){
        var mousePos = stage.getPointerPosition();
        console.log(mousePos);
      })
      
    },
    adicionarImagemNoLayer(imagem_objeto){
      let imagem = new Konva.Image({
        image: imagem_objeto,
        id: 'imagem'
      })

      this.layer = new Konva.Layer();
      this.layer.add(imagem);
      this.stage.add(this.layer);
      this.imagemAdicionada();
    },
    imagemInput(e){
      let imagem_input = e.target.files[0];
      this.image_url = URL.createObjectURL(imagem_input);
      
      let imagem_objeto = new Image();
      imagem_objeto.src = this.image_url;
      imagem_objeto.onload = this.adicionarImagemNoLayer(imagem_objeto);
    },
  },
  mounted(){
    var width = 500;
    var height = 500;

    this.stage = new Konva.Stage({
      container: 'konva-stage',
      width: width,
      height: height,
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
