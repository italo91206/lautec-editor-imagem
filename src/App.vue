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

    <div class="form-group">
      <button @click="salvarImagem">Salvar imagem</button>
    </div>
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
      layer_novo: null,
    }
  },
  methods: {
    salvarImagem(){
      let data_url = this.stage.toDataURL({ pixelRatio: 3 });
      let link = document.createElement('a');
      link.download = 'imagem.jpeg';
      link.href = data_url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    imagemAdicionada(){
      let stage = this.stage;
      let evento = window.innerWidth < 768 ? 'tap': 'click';
      console.log(evento);
      stage.on(evento, function(){
        let posicaoMouse = stage.getPointerPosition();
        console.log(posicaoMouse);

        let layer = new Konva.Layer();
        let circle = new Konva.Circle({
          x: posicaoMouse.x,
          y: posicaoMouse.y,
          radius: 10,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
        });

        layer.add(circle);
        stage.add(layer);
        console.log(stage);
        // this.stage.add(this.layer_novo);
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
