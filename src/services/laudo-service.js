import api from './api/instanceApi';

const LaudoService = {
  create: async(contratante, rua, nome_edificio, usuario_id) => {
    try{
      const response = await api.post('/laudo/insertLaudo', {
        contratante: contratante,
        rua: rua,
        nome_edificio: nome_edificio,
        usuario_id: usuario_id
      })

      return response;
    }
    catch(error){
      console.log(error);
    }
  },
  browse: async(usuario_id) => {
    try{
      const response = await api.get('/laudo/getLaudos', {
        params: { usuario_id: usuario_id} 
      });

      return response;
    }
    catch(error){
      console.log(error);
    }
  },
  get: async(laudo_id, usuario_id) => {
    try {
      const response = await api.get('/laudo/getLaudo', {
        params: { 
          usuario_id: usuario_id,
          laudo_id: laudo_id
        }
      })
      return response;
    }
    catch(error){
      console.log(error);
    }
  },
  image_upload: async(formData) => {
    let dados;
    try{
      dados = await api.post('/laudo/upload-imagem', 
        formData,
        { 
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          }
        })

      return dados;
    }
    catch(error){
      console.log(error)
    }
  }
}

export default LaudoService;