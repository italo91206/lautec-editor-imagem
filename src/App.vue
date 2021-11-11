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

    <div class="form-group row">
      <button @click="undo">Desfazer</button>
      <p>Etapa atual: {{ numero_iteracoes }}</p>
      <button @click="redo">Refazer</button>
    </div>

    <div class="row">
      <div class="col-9">
        <div id="konva-stage"></div>
      </div>
      <div class="col-3 etapas-list">
        <p v-for="iteracao in iteracoes" :key="iteracao.key" class="etapa">
          {{iteracao.titulo}}<br/>
          {{iteracao.classe}}
        </p>
      </div>
    </div>
    

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
      imagem: null,
      numero_iteracoes: 0,
      iteracao_atual: 0,
      iteracoes: [],
    }
  },
  methods: {
    salvarImagem(){
      let data_url = this.stage.toDataURL({ pixelRatio: 3 });
      let link = document.createElement('a');
      link.download = 'imagem.jpeg';
      link.href = data_url;
      this.imagem = data_url;
      document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
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

      let evento = window.innerWidth < 768 ? 'tap': 'click';

      this.layer = new Konva.Layer();
      this.layer.add(imagem);
      this.stage.add(this.layer);
      this.stage.on(evento, () => { this.addEventoClick(); })
    },
    imagemInput(e){
      let imagem_input = e.target.files[0];
      this.image_url = URL.createObjectURL(imagem_input);
      
      let imagem_objeto = new Image();
      imagem_objeto.src = this.image_url;
      imagem_objeto.onload = this.adicionarImagemNoLayer(imagem_objeto);
    },
    undo(){
      // if(this.iteracao_atual > 0)
      //   this.iteracao_atual--;
      // this.iteracoes = this.iteracoes.filter(iteracao =>{return iteracao != this.iteracao_atual});
      console.log(`Let's undo it!`);
    },
    redo(){
      // if(this.iteracao_atual > 0)
      //   this.iteracao_atual++;
      // this.iteracoes = this.iteracoes.filter(iteracao =>{return iteracao != this.iteracao_atual});
      console.log('Lets re-do it !');
    }
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
.row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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

.etapa {
    text-align: left;
    margin: unset;
    margin-bottom: 10px;
}

</style>
