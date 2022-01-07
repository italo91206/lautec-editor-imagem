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

      <div id="editor-opcoes-top">
        <button class="editor-opcoes-top--opcao"><i class="fas fa-search-minus"></i></button>
        <button class="editor-opcoes-top--opcao"><i class="fas fa-search-plus"></i></button>
        <div class="vertical-separator"></div>
        <button class="editor-opcoes-top--opcao"><i class="fas fa-eraser"></i></button>
        <button class="editor-opcoes-top--opcao"><i class="fas fa-trash"></i></button>
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
            <select v-model="formatoSelecionado">
              <option value="circulo">Círculo</option>
              <option value="quadrado">Quadrado</option>
            </select>

            <input type="color" v-model="corSelecionada"> 
          </div>

          <div v-else-if="opcao == 'adicionar-texto'" class="specific-options-bar--adicionar-texto">
            <input type="text" v-model="textoPraAdicionar"> 
            <input type="color" v-model="corSelecionada"> 
          </div>

          <div v-else-if="opcao == 'cortar-imagem'" class="specific-options-bar--cortar-imagem">
            <button>cortar imagem</button>
          </div>

          <div v-else-if="opcao == 'redimensionar-imagem'" class="specific-options-bar--cortar-imagem">
            <div class="form-group">
              <label for="">Largura</label>
              <input type="range" 
                min="1" :max="largura_maxima" 
                v-model="largura_imagem"
                @input="handleImageResize('width', largura_imagem)"
              >
              <label for="">{{ largura_imagem }}</label>
            </div>

            <div class="form-group">
              <label for="">Altura</label>
              <input type="range" 
                min="1" :max="altura_maxima" 
                v-model="altura_imagem"
                @input="handleImageResize('height', altura_imagem)"
              >
              <label for="">{{ altura_imagem }}</label>
            </div>

            <div class="form-group">
              <label for="">Rotação</label>
              <input type="range"
                min="0" max="360" step="1"
                v-model="rotacao_imagem"
                @input="handleImageResize('rotation', rotacao_imagem)"
              >
              <label for="">{{ rotacao_imagem }}</label>
            </div>

            <div class="form-group">
              <label for="">Zoom</label>
              <input type="range"
                min="0.1" max="4" step="0.1"
                v-model="scale_image"
                @input="handleImageScale(scale_image)"
              >
              <label for="">{{ scale_image }}</label>
            </div>

            <div class="form-group">
              <button @click="resetImageResize">Resetar</button>
            </div>
          </div>

          <div v-else-if="opcao == 'ajuste-de-brilho'" class="specific-options-bar--ajuste-de-brilho">
            <div class="form-group">
              <label for="">Brilho</label>
              <input type="range" 
                min="-1" max="1" step="0.01"
                @input="handleImageFilter('brightness', brilho_imagem)" 
                v-model="brilho_imagem"
              >
              <label for="">{{ brilho_imagem }}</label>
            </div>

            <div class="form-group">
              <label for="">Realce</label>
              <input type="range"
                min="-1" max="1" step="0.01"
                @input="handleImageFilter('enhance', realce_imagem)"
                v-model="realce_imagem"
              />
              <label for="">{{ realce_imagem }}</label>
            </div>

            <div class="form-group">
              <label for="">Contraste</label>
              <input type="range"
                min="-100" max="100" step="1"
                @input="handleImageFilter('contrast', contraste_imagem)"
                v-model="contraste_imagem"
              >
              <label for="">{{ contraste_imagem }}</label>
            </div>

            <div class="form-group">
              <button @click="resetImageFilters">
                Resetar
              </button>
            </div>
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
      imagem_bkp: null,
      numero_iteracoes: 0,
      iteracao_atual: 0,
      iteracoes: [],
      retirado: [],
      proximo_clique: '',
      opcao: '',
      formatoSelecionado: 'circulo',
      corSelecionada: "#c40824",
      textoPraAdicionar: 'texto',
      transfomer: null,
      largura_maxima: null,
      largura_imagem: null,
      altura_maxima: null,
      altura_imagem: null,
      rotacao_imagem: 0,
      scale_image: 1,
      brilho_imagem: 0,
      realce_imagem: 0,
      contraste_imagem: 0,
    }
  },
  methods: {
    salvarImagem(){
      let data_url = this.stage.toDataURL({ pixelRatio: 2 });
      let link = document.createElement('a');
      link.download = 'imagem.jpeg';
      link.href = data_url;
      this.imagem = data_url;
      document.body.appendChild(link);
      link.click();
    },
    addEventoClick(string){
      console.log(string);
      let stage = this.stage;
      let layer = this.layer;
      let cor = this.corSelecionada;
      let formatoSelecionado = this.formatoSelecionado;
      let opcao = this.opcao;

      let posicaoMouse = stage.getPointerPosition();
        //console.log(posicaoMouse);
      let nome_classe = `icone-${this.numero_iteracoes++}`;
      // let layer = new Konva.Layer();
      let objeto;
      
      if(opcao == 'adicionar-icone'){
        if(formatoSelecionado == 'circulo'){
          objeto = new Konva.Circle({
            x: posicaoMouse.x,
            y: posicaoMouse.y,
            radius: 10,
            fill: cor,
            stroke: 'black',
            strokeWidth: 2,
            class: nome_classe,
            draggable: true,
          });
        }
        else if(formatoSelecionado == 'quadrado'){
          objeto = new Konva.Rect({
            x: posicaoMouse.x,
            y: posicaoMouse.y,
            width: 10,
            height: 10,
            fill: cor,
            stroke: 'black',
            strokeWidth: 2,
            class: nome_classe,
            draggable: true,
          });
        }
      }
      else if(opcao == 'adicionar-texto'){
        let textoPraAdicionar = this.textoPraAdicionar;
        
        objeto = new Konva.Text({
          text: textoPraAdicionar,
          x: posicaoMouse.x,
          y: posicaoMouse.y,
          fontSize: 20,
          fill: cor,
          draggable: true,
        });

        this.textoPraAdicionar = '';
      }      

      let evento = window.innerWidth < 768 ? 'tap': 'click';
      objeto.on(evento, (objeto) => {
        this.handleTransform(objeto)
      });

      layer.add(objeto);
      stage.add(layer);
      this.opcao = '';
      // this.stage.add(this.layer_novo);
      this.iteracoes.push({ titulo: 'Adicionei novo circulo', classe: nome_classe })
    },
    handleTransform(e){
      let objeto = e.target
      let transformer = this.transformer;

      // console.log('--handleTransform');
      // console.log(transformer);

      transformer.nodes([objeto]);

      objeto.on('transformstart', () => {
        // console.log('--transform start');
      })

      objeto.on('dragmove', () => {
        // console.log('--drag move');
      })

      objeto.on('transform', () => {
        // console.log('--transform');
      })

      objeto.on('transformend', () => {
        // console.log('--transform end');
      })
    },
    handleResetHandler(){
      console.log('--handleResetHandler');
      console.log(this.transformer);
    },
    handleImageFilter(attr, value){      
      this.imagem.cache();
       
      this.imagem.filters([
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.Enhance
      ])

      let parsed_value = parseFloat(value, 10);      
      //console.log('--handleImageFilter: ' + parsed_value);
      if(attr == 'brightness') this.imagem.brightness(parsed_value);
      else if(attr == 'enhance') this.imagem.enhance(parsed_value);
      else if(attr == 'contrast') this.imagem.contrast(parsed_value);
    },
    resetTransform(){
      let transformer = this.transformer;
      console.log('--resetTransform')
      console.log(transformer);
      transformer.nodes([]);
    },
    resetImageFilters(){
      this.imagem.clearCache();
      this.imagem = this.imagem_bkp;
      this.contraste_imagem = 0;
      this.realce_imagem = 0;
      this.brilho_imagem = 0;
    },
    resetImageResize(){
      // this.imagem.clearCache();
      // let height = parseInt(this.imagem_bkp.getAttr('height'), 10);
      // let width = parseInt(this.imagem_bkp.getAttr('width'), 10);
    
      this.altura_imagem = 500;
      this.largura_imagem = 425;
      this.rotacao_imagem = 0;
      this.scale_image = 1;

      this.imagem.setAttr('height', 500);
      this.imagem.setAttr('width', 425);
      this.imagem.rotation(0);
      this.imagem.scale({ x: 1, y: 1 });
      // this.imagem = this.imagem_bkp;
    },
    adicionarImagemNoLayer(imagem_objeto){
      let transformer = new Konva.Transformer();
      let imagem = new Konva.Image({
        image: imagem_objeto,
        id: 'imagem',
        width: 425,
        height: 500,
        scaleY: 1,
        scaleX: 1,
        x: 213,
        y: 250,
        draggable: true,
        offset: {
          x: 213,
          y: 250
        }
      })

      this.imagem = imagem;
      this.imagem_bkp = imagem;

      let evento = window.innerWidth < 768 ? 'tap': 'click';

      let layer = new Konva.Layer();
      layer.add(imagem);
      layer.add(transformer);
      
      this.stage.add(layer);
      this.layer = layer;
      this.transformer = transformer;
      
      this.stage.on(evento, () => { 
        if(this.opcao != '')  
          this.addEventoClick(this.opcao);
      });

      this.imagem.on(evento, () => {
        this.resetTransform();
      })

      let width = parseInt(this.imagem.getAttr('width'), 10);
      this.largura_imagem = width;
      this.largura_maxima = width * 2;

      let height = parseInt(this.imagem.getAttr('height'), 10);
      this.altura_imagem = height;
      this.altura_maxima = height * 2;

      console.log(this.imagem.getAttr('height'))
    },
    handleImageResize(attr, value){
      let value_parsed = parseInt(value, 10);
      //console.log(value_parsed);
      this.imagem.setAttr(attr, value_parsed);
    },
    handleImageScale(value){
      let parsed_value = parseFloat(value, 10);
      this.scale_image = parsed_value;
      this.imagem.scale({
        x: parsed_value,
        y: parsed_value
      });
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
    // console.log('Fui montado!')
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
