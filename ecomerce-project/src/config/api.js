// config_api.js (ou l'endroit où tu stockes tes constantes)
export const API = {
    BASE_URL: import.meta.env.VITE_API_URL + '/api',
    REGISTER: '/auth/register',
    LOGIN: '/auth/token/pair',
    REFRESH: '/auth/token/refresh',
};
