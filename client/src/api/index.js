import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

export const transactionAPI = {
    add: (data) => api.post('/transactions/add/', data),
    getHistory: () => api.get('/transactions/history/'),
    getSummary: () => api.get('/transactions/summary/'),
};
