const ENVIROMENT = process.env.NODE_ENV;

export const config = {
    setBaseUrl: () => {
        let baseURL = `http://localhost:3000/`

        if(ENVIROMENT === 'production') baseURL = `https://lautech-backend.herokuapp.com/`

        return baseURL;
    },
};
