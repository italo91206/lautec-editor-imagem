<template>
  <div id="app">
    <div class="container">
      <div class="form-group">
        <button @click="capturarImagem" class="flex">
          <i class="fas fa-camera"></i>
          Capturar imagem
        </button>

        <button @click="abrirGaleria" class="flex">
          <i class="far fa-image"></i>
          Abrir galeria
        </button>
      </div>

      <div class="form-group">
        <input id="abrir-galeria" 
          class="hidden"
          @input="imagemInput" type="file" 
          accept="image/*" style="display: none;"
        >

        <input id="capturar-imagem" 
          class="hidden"
          @input="imagemInput" type="file" 
          accept="image/*" capture
        >
      </div>

      <div class="form-group row">
        <button @click="undo">
          <i class="fas fa-undo-alt"></i>
        </button>
        
        <p>Etapa atual: {{ numero_iteracoes }}</p>

        <button @click="redo">
          <i class="fas fa-redo-alt"></i>
        </button>
      </div>

      <div id="image-editor">
        <div class="col-9 konva-wrapper">
          <div id="konva-stage"></div>
        </div>

        <div class="specific-options-bar--wrapper">
          <div v-if="opcao == 'adicionar-icone'" class="specific-options-bar--adicionar-icone">
            <button>adicionar icone</button>
          </div>

          <div v-else-if="opcao == 'adicionar-texto'" class="specific-options-bar--adicionar-texto">
            <button>adicionar texto</button>
          </div>

          <div v-else-if="opcao == 'cortar-imagem'" class="specific-options-bar--cortar-imagem">
            <button>cortar imagem</button>
          </div>

          <div v-else-if="opcao == 'redimensionar-imagem'" class="specific-options-bar--cortar-imagem">
            <button>redimensionar imagem</button>
          </div>

          <div v-else-if="opcao == 'ajuste-de-brilho'" class="specific-options-bar--ajuste-de-brilho">
            <button>teste</button>
          </div>
        </div>

        <div class="col-3 options-bar">
          <button @click="opcao = 'adicionar-icone'">Adicionar ícone</button>
          <button @click="opcao = 'adicionar-texto'">Adicionar texto</button>
          <button @click="opcao = 'cortar-imagem'">Cortar Imagem</button>
          <button @click="opcao = 'redimensionar-imagem'">Redimensionar imagem</button>
          <button @click="opcao = 'ajuste-de-brilho'">Ajuste de brilho</button>
        </div>
      </div>

      <div class="form-group">
        <button @click="salvarImagem">
          <p class="flex">
            <i class="fas fa-save"></i>
            Salvar imagem
          </p>
        </button>
      </div>
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
      imagem: null,
      numero_iteracoes: 0,
      iteracao_atual: 0,
      iteracoes: [],
      retirado: [],
      proximo_clique: '',
      opcao: '',
    }
  },
  methods: {
    novoShape(){
      let stage = this.stage.getStage();
      console.log(stage);
      let layer = stage.getLayers();
      layer = layer[0];
      
      let retangulo = new Konva.Rect({
        x: 160,
        y: 60,
        width: 100,
        height: 90,
        fill: 'red',
        name: 'rect',
        stroke: 'black',
        draggable: true,
      });
      layer.add(retangulo);

      // var transformer = new Konva.Transformer();
      // layer.add(transformer);
      // transformer.nodes([retangulo]);
      // stage.add(layer);
    },
    salvarImagem(){
      let data_url = this.stage.toDataURL({ pixelRatio: 3 });
      let link = document.createElement('a');
      link.download = 'imagem.jpeg';
      link.href = data_url;
      this.imagem = data_url;
      document.body.appendChild(link);
    },
    addEventoClick(){
      let stage = this.stage;
      let layer = this.layer;

      let posicaoMouse = stage.getPointerPosition();
        console.log(posicaoMouse);
        let nome_classe = `circulo-${this.numero_iteracoes++}`;
        // let layer = new Konva.Layer();
        let circle = new Konva.Circle({
          x: posicaoMouse.x,
          y: posicaoMouse.y,
          radius: 10,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          class: nome_classe
        });

        layer.add(circle);
        stage.add(layer);
        // this.stage.add(this.layer_novo);
        this.iteracoes.push({ titulo: 'Adicionei novo circulo', classe: nome_classe })
    },
    adicionarImagemNoLayer(imagem_objeto){
      let imagem = new Konva.Image({
        image: imagem_objeto,
        id: 'imagem'
      })
      this.imagem = imagem;

      let evento = window.innerWidth < 768 ? 'tap': 'click';

      let layer = new Konva.Layer();
      layer.add(imagem);
      this.layer = layer;
      this.stage.add(layer);
      this.stage.on(evento, () => { this.addEventoClick(); })
    },
    imagemInput(e){
      this.montarStage();
      
      let imagem_input = e.target.files[0];
      this.image_url = URL.createObjectURL(imagem_input);
      
      let imagem_objeto = new Image();
      imagem_objeto.src = this.image_url;
      imagem_objeto.onload = this.adicionarImagemNoLayer(imagem_objeto);
    },
    undo(){
      let layer = { ...this.layer };
      // let stage = { ...this.stage };
      
      let remover = layer.children.pop();
      this.retirado.push(remover);

      this.stage.draw();

      // console.log(layer.children);
    },
    redo(){
      let layer = { ...this.layer };

      let adicionar = this.retirado.pop();
      layer.children.push(adicionar);

      this.stage.draw();
    },
    montarStage(){
      let container = document.querySelector('.container')
      var width = container.clientWidth - 30;
      var height = 500;

      let stage = new Konva.Stage({
        container: 'konva-stage',
        width: width,
        height: height,
      });

      this.stage = stage;
    },
    abrirGaleria(){
      let el = document.querySelector('#abrir-galeria');
      el.click();
    },
    capturarImagem(){
      let el = document.querySelector('#capturar-imagem');
      el.click();
    }
  },
  mounted(){
    console.log('Fui montado!')
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
}
.row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.col-9.konva-wrapper{
  width: 425px;
  height: 500px;
}

.hidden {
  opacity: 0;
  visibility: hidden;
}

.col-9 {
    flex: 0 0 500px;
    width: 100%;
}

.col-3 {
    flex: 0 0 35%;
    width: 100%;
}
.etapas-list {
    max-height: 500px;
    overflow: auto;
}

.options-bar {
    display: flex;
    flex: 1;
}

.etapa {
    text-align: left;
    margin: unset;
    margin-bottom: 10px;
}

</style>
