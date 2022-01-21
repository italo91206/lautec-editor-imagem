<template>
  <div id="editor-de-imagem">
    <div class="container">
      <div id="editor-opcoes-top">
        <button
          class="editor-opcoes-top--opcao"
          @click="handleImageResizeButton('minus')"
        >
          <i class="fas fa-search-minus"></i>
        </button>
        <button
          class="editor-opcoes-top--opcao"
          @click="handleImageResizeButton('plus')"
        >
          <i class="fas fa-search-plus"></i>
        </button>
        <button
          class="editor-opcoes-top--opcao editor-opcoes-top--opcao--dragging"
          :class="{ dragging_enabled: is_dragging }"
          @click="is_dragging = !is_dragging"
        >
          <i class="far fa-hand-rock"></i>
        </button>

        <div class="vertical-separator"></div>

        <button class="editor-opcoes-top--opcao" @click="undo">
          <i class="fas fa-undo-alt"></i>
        </button>
        <button class="editor-opcoes-top--opcao" @click="redo">
          <i class="fas fa-redo-alt"></i>
        </button>

        <div class="vertical-separator"></div>

        <button
          class="editor-opcoes-top--opcao"
          @click="removeNode"
          :class="{ disabled: selected_node == null }"
        >
          <i class="fas fa-eraser"></i>
        </button>

        <button class="editor-opcoes-top--opcao" @click="resetStage">
          <i class="fas fa-trash"></i>
        </button>
      </div>

      <div class="form-group" style="display: none">
        <input
          id="abrir-galeria"
          class="hidden"
          @input="imagemInput"
          type="file"
          accept="image/*"
          style="display: none"
        />

        <input
          id="capturar-imagem"
          class="hidden"
          @input="imagemInput"
          type="file"
          accept="image/*"
          capture
        />
      </div>

      <div id="image-editor">
        <div id="image-load-options" class="form-group" v-if="imagem == null">
          <div class="image-load-options--row">
            <button @click="capturarImagem" class="flex">
              <i class="fas fa-camera"></i>
              Capturar imagem
            </button>

            <p>ou</p>

            <button @click="abrirGaleria" class="flex">
              <i class="far fa-image"></i>
              Abrir galeria
            </button>
          </div>
        </div>

        <div class="col-9 konva-wrapper">
          <div id="konva-stage"></div>
        </div>
      </div>

      <div class="specific-options-bar--wrapper">
        <div
          v-if="opcao == 'adicionar-icone'"
          class="specific-options-bar--adicionar-icone"
        >
          <select v-model="formatoSelecionado">
            <option value="circulo">Círculo</option>
            <option value="quadrado">Quadrado</option>
          </select>

          <input type="color" v-model="corSelecionada" />
        </div>

        <div
          v-else-if="opcao == 'adicionar-texto'"
          class="specific-options-bar--adicionar-texto"
        >
          <input type="text" v-model="textoPraAdicionar" />
          <input type="color" v-model="corSelecionada" />
        </div>

        <div
          v-else-if="opcao == 'cortar-imagem'"
          class="specific-options-bar--cortar-imagem"
        >
          <button>cortar imagem</button>
        </div>

        <div
          v-else-if="opcao == 'redimensionar-imagem'"
          class="specific-options-bar--cortar-imagem"
        >
          <div class="form-group">
            <label for="">Largura</label>
            <input
              type="range"
              min="1"
              :max="largura_maxima"
              v-model="largura_imagem"
              @input="handleImageResize('width', largura_imagem)"
            />
            <label for="">{{ largura_imagem }}</label>
          </div>

          <div class="form-group">
            <label for="">Altura</label>
            <input
              type="range"
              min="1"
              :max="altura_maxima"
              v-model="altura_imagem"
              @input="handleImageResize('height', altura_imagem)"
            />
            <label for="">{{ altura_imagem }}</label>
          </div>

          <div class="form-group">
            <label for="">Rotação</label>
            <input
              type="range"
              min="0"
              max="360"
              step="10"
              v-model="rotacao_imagem"
              @input="handleImageResize('rotation', rotacao_imagem)"
            />
            <label for="">{{ rotacao_imagem }}</label>
          </div>

          <div class="form-group">
            <label for="">Zoom</label>
            <input
              type="range"
              min="0.1"
              max="4"
              step="0.1"
              v-model="scale_image"
              @input="handleImageScale(scale_image)"
            />
            <label for="">{{ scale_image }}</label>
          </div>

          <div class="form-group">
            <button @click="resetImageResize">Resetar</button>
          </div>
        </div>

        <div
          v-else-if="opcao == 'ajuste-de-brilho'"
          class="specific-options-bar--ajuste-de-brilho"
        >
          <div class="form-group">
            <label for="">Brilho</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              @input="handleImageFilter('brightness', brilho_imagem)"
              v-model="brilho_imagem"
            />
            <label for="">{{ brilho_imagem }}</label>
          </div>

          <div class="form-group">
            <label for="">Realce</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              @input="handleImageFilter('enhance', realce_imagem)"
              v-model="realce_imagem"
            />
            <label for="">{{ realce_imagem }}</label>
          </div>

          <div class="form-group">
            <label for="">Contraste</label>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              @input="handleImageFilter('contrast', contraste_imagem)"
              v-model="contraste_imagem"
            />
            <label for="">{{ contraste_imagem }}</label>
          </div>

          <div class="form-group">
            <button @click="resetImageFilters">Resetar</button>
          </div>
        </div>
      </div>

      <div id="editor-opcoes-bottom">
        <button
          class="editor-opcoes-top--opcao"
          @click="opcao = 'adicionar-icone'"
          :class="{ active: opcao == 'adicionar-icone' }"
        >
          <i class="fas fa-shapes"></i>
        </button>

        <button
          class="editor-opcoes-top--opcao"
          @click="opcao = 'adicionar-texto'"
          :class="{ active: opcao == 'adicionar-texto' }"
        >
          <i class="fas fa-font"></i>
        </button>

        <button
          class="editor-opcoes-top--opcao"
          @click="opcao = 'cortar-imagem'"
          :class="{ active: opcao == 'cortar-imagem' }"
        >
          <i class="fas fa-crop-alt"></i>
        </button>

        <button
          class="editor-opcoes-top--opcao"
          @click="opcao = 'redimensionar-imagem'"
          :class="{ active: opcao == 'redimensionar-imagem' }"
        >
          <i class="fas fa-sliders-h"></i>
        </button>

        <button
          class="editor-opcoes-top--opcao"
          @click="opcao = 'ajuste-de-brilho'"
          :class="{ active: opcao == 'ajuste-de-brilho' }"
        >
          <i class="fas fa-magic"></i>
        </button>
      </div>

      <div id="save-button">
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
import Konva from "konva";

export default {
  name: "EditorDeImagem",
  data() {
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
      proximo_clique: "",
      opcao: "",
      formatoSelecionado: "circulo",
      corSelecionada: "#c40824",
      textoPraAdicionar: "texto",
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
      is_dragging: false,
      selected_node: null,
      last_removed_node: null,
      removed_nodes: [],
    };
  },
  methods: {
    async urltoFile(url, filename, mimeType){
      mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
      return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename, {type:mimeType});})
      );
    },
    async salvarImagem() {
      // let imagem_url = this.imagem_url;
      // var file = new File([myBlob], "name");
      let data_url = this.stage.toDataURL({ pixelRatio: 2 });
      const file = await this.urltoFile(data_url, "teste.jpeg");
      //console.log(blob);
      // let link = document.createElement("a");
      // link.download = "imagem.jpeg";
      // link.href = data_url;
      // this.imagem = data_url;
      // document.body.appendChild(link);
      // link.click();
      this.$emit('terminou_edicao', file);
    },
    addEventoClick(string) {
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

      if (opcao == "adicionar-icone") {
        if (formatoSelecionado == "circulo") {
          objeto = new Konva.Circle({
            x: posicaoMouse.x,
            y: posicaoMouse.y,
            radius: 15,
            fill: cor,
            stroke: "black",
            strokeWidth: 2,
            class: nome_classe,
            draggable: true,
          });
        } else if (formatoSelecionado == "quadrado") {
          objeto = new Konva.Rect({
            x: posicaoMouse.x,
            y: posicaoMouse.y,
            width: 30,
            height: 30,
            fill: cor,
            stroke: "black",
            strokeWidth: 2,
            class: nome_classe,
            draggable: true,
          });
        }
      } else if (opcao == "adicionar-texto") {
        let textoPraAdicionar = this.textoPraAdicionar;

        objeto = new Konva.Text({
          text: textoPraAdicionar,
          x: posicaoMouse.x,
          y: posicaoMouse.y,
          fontSize: 20,
          fill: cor,
          draggable: true,
        });

        this.textoPraAdicionar = "";
      }

      let evento = window.innerWidth < 768 ? "tap" : "click";
      objeto.on(evento, (objeto) => {
        this.handleTransform(objeto);
      });

      layer.add(objeto);
      stage.add(layer);
      this.opcao = "";
      // this.stage.add(this.layer_novo);
      this.iteracoes.push({
        titulo: "Adicionei novo circulo",
        classe: nome_classe,
      });
    },
    handleTransform(e) {
      let objeto = e.target;
      this.selected_node = objeto;

      let transformer = this.transformer;

      // console.log('--handleTransform');
      // console.log(transformer);

      transformer.nodes([objeto]);

      objeto.on("transformstart", () => {
        // console.log('--transform start');
      });

      objeto.on("dragmove", () => {
        // console.log('--drag move');
      });

      objeto.on("transform", () => {
        // console.log('--transform');
      });

      objeto.on("transformend", () => {
        // console.log('--transform end');
      });
    },
    handleResetHandler() {
      console.log("--handleResetHandler");
      console.log(this.transformer);
    },
    handleImageFilter(attr, value) {
      this.imagem.cache();

      this.imagem.filters([
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.Enhance,
      ]);

      let parsed_value = parseFloat(value, 10);
      //console.log('--handleImageFilter: ' + parsed_value);
      if (attr == "brightness") this.imagem.brightness(parsed_value);
      else if (attr == "enhance") this.imagem.enhance(parsed_value);
      else if (attr == "contrast") this.imagem.contrast(parsed_value);
    },
    resetTransform() {
      let transformer = this.transformer;
      // console.log('--resetTransform')
      // console.log(transformer);
      transformer.nodes([]);
      this.selected_node = null;
    },
    removeNode() {
      let selected_node = this.selected_node;
      // console.log('--removeNoded');
      // console.log(selected_node)
      if (selected_node !== null) {
        this.removed_nodes.push(selected_node);
        selected_node.remove();
        this.transformer.nodes([]);
      }
    },
    resetImageFilters() {
      this.imagem.clearCache();
      this.imagem = this.imagem_bkp;
      this.contraste_imagem = 0;
      this.realce_imagem = 0;
      this.brilho_imagem = 0;
    },
    resetImageResize() {
      // this.imagem.clearCache();
      // let height = parseInt(this.imagem_bkp.getAttr('height'), 10);
      // let width = parseInt(this.imagem_bkp.getAttr('width'), 10);

      this.altura_imagem = 500;
      this.largura_imagem = 425;
      this.rotacao_imagem = 0;
      this.scale_image = 1;

      this.imagem.setAttr("height", 500);
      this.imagem.setAttr("width", 425);
      this.imagem.rotation(0);
      this.imagem.scale({ x: 1, y: 1 });
      // this.imagem = this.imagem_bkp;
    },
    adicionarImagemNoLayer(imagem_objeto) {
      let transformer = new Konva.Transformer();
      let imagem = new Konva.Image({
        image: imagem_objeto,
        id: "imagem",
        width: 425,
        height: 500,
        scaleY: 1,
        scaleX: 1,
        x: 213,
        y: 250,
        offset: {
          x: 213,
          y: 250,
        },
      });

      this.imagem = imagem;
      this.imagem_bkp = imagem;

      let evento = window.innerWidth < 768 ? "tap" : "click";

      let layer = new Konva.Layer();
      layer.add(imagem);
      layer.add(transformer);

      this.stage.add(layer);
      this.layer = layer;
      this.transformer = transformer;

      this.stage.on(evento, () => {
        if (this.opcao != "") this.addEventoClick(this.opcao);
      });

      this.imagem.on(evento, () => {
        this.resetTransform();
      });

      let width = parseInt(this.imagem.getAttr("width"), 10);
      this.largura_imagem = width;
      this.largura_maxima = width * 2;

      let height = parseInt(this.imagem.getAttr("height"), 10);
      this.altura_imagem = height;
      this.altura_maxima = height * 2;
    },
    handleImageResize(attr, value) {
      let value_parsed = parseInt(value, 10);
      //console.log(value_parsed);
      this.imagem.setAttr(attr, value_parsed);
    },
    handleImageResizeButton(arg) {
      let { x, y } = this.imagem.scale();
      if (arg == "plus" && x <= 3.8)
        this.imagem.scale({ x: x + 0.2, y: y + 0.2 });
      else if (arg == "minus" && x >= 0.3)
        this.imagem.scale({ x: x - 0.2, y: y - 0.2 });
    },
    handleImageScale(value) {
      let parsed_value = parseFloat(value, 10);
      this.scale_image = parsed_value;
      this.imagem.scale({
        x: parsed_value,
        y: parsed_value,
      });
    },
    imagemInput(e) {
      this.montarStage();

      let imagem_input = e.target.files[0];
      this.image_url = URL.createObjectURL(imagem_input);

      let imagem_objeto = new Image();
      imagem_objeto.src = this.image_url;
      imagem_objeto.onload = this.adicionarImagemNoLayer(imagem_objeto);
    },
    undo() {
      let layer = this.layer;
      // console.log(layer.children.length);
      if (layer.children.length > 2) {
        let node = layer.children.pop();
        this.removed_nodes.push(node);
        this.stage.draw();
      }
    },
    redo() {
      let layer = this.layer;
      let node = this.removed_nodes.pop();
      console.log(node);
      if (node != null) {
        layer.children.push(node);
        this.stage.draw();
      }
    },
    montarStage() {
      let container = document.querySelector(".container");
      var width = 425;
      var height = 500;

      if (container.clientWidth <= 460) width = container.clientWidth - 30;

      console.log("tamanho do meu width do stage vai ser: " + width);

      let stage = new Konva.Stage({
        container: "konva-stage",
        width: width,
        height: height,
      });

      this.stage = stage;
    },
    abrirGaleria() {
      let el = document.querySelector("#abrir-galeria");
      el.click();
    },
    capturarImagem() {
      let el = document.querySelector("#capturar-imagem");
      el.click();
    },
    resetStage() {
      this.stage.destroy();
      this.imagem = null;
    },
  },
  mounted() {
    // console.log('Fui montado!')
  },
  watch: {
    is_dragging() {
      if (this.imagem != null && this.is_dragging == true)
        this.imagem.setAttr("draggable", true);
      else if (this.imagem != null && this.is_dragging == false)
        this.imagem.setAttr("draggable", false);
    },
    layer() {
      console.log("Meu layer foi atualizado!");
    },
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.col-9.konva-wrapper {
  width: 100%;
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

#image-editor {
  position: relative;
}

#image-load-options {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #343434;
}

#save-button {
  margin-top: 20px;
}

#save-button button {
  background: #dfdfdf;
  border: unset;
  border-radius: 10px;
  color: #1b6262;
  font-weight: bold;
  text-transform: uppercase;
  width: 300px;
  height: 50px;
}

#save-button i {
  font-size: 22px;
}

#save-button button p {
  display: flex;
  justify-content: center;
  align-items: center;
}

#save-button button i {
  margin-right: 10px;
  font-size: 22px;
}

#image-load-options button {
  width: 300px;
  height: 50px;
}

.editor-opcoes-top--opcao.disabled {
  color: #1b62625e;
  cursor: none;
}

.konvajs-content {
  background: #383838;
}

#editor-opcoes-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: solid 5px #2bb7b5;
  background: #f3f3f3;
}

.vertical-separator {
  height: 17px;
  width: 2px;
  background: #ffffff;
}

.image-load-options--row {
  color: #f3f3f3;
}

.image-load-options--row button {
  background: #2bb7b5;
  border: unset;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3f3f3;
  font-weight: bold;
  text-transform: uppercase;
}

.editor-opcoes-top--opcao {
  background: unset;
  border: unset;
  padding: 5px;
  color: #1b6262;
  font-size: 20px;
  font-weight: 100;
}

.dragging_enabled {
  background: #ffffff91;
  border-radius: 100%;
  color: #1b6262;
}

.editor-opcoes-top--opcao--dragging {
  width: 33px;
}

#editor-opcoes-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: solid 5px #2bb7b5;
  background: #f3f3f3;
}

#editor-opcoes-bottom .active {
  background: #ffffff91;
  border-radius: 100%;
  color: #1b6262;
}

#editor-opcoes-bottom button {
  width: 33px;
  height: 33px;
}
</style>
