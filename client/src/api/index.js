import axios from 'axios';

const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    // Replace any accidental double slashes but keep the protocol ones
    return url.replace(/([^:]\/)\/+/g, "$1");
};

const api = axios.create({
    baseURL: getBaseURL(),
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
