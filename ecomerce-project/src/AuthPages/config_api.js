export const API = {
    BASE_URL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
    REGISTER: '/users/',
    LOGIN: '/token/pair',
    REFRESH: '/token/refresh',
};
