import axios from 'axios';
import {config} from './config';

const bURL = config.setBaseUrl();

const configApiLocal = {
    baseURL: `${bURL}`,
    responseType: 'json',
};

const api = axios.create(configApiLocal);

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('user');

    if (token) config.headers.Authorization = token;
    return config;
});

export default api;