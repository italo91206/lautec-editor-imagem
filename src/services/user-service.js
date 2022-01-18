import api from './api/instanceApi';

const UserService = {
  login: async(email, senha) => {
    try{
      const response = await api.post('/auth/login', {
        email: email,
        senha: senha,
      })

      return response;
    }
    catch(error){
      console.log(error);
    }
  }
}

export default UserService;