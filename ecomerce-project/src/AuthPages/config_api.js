// ecomerce-project/src/AuthPages/config_api.js
export const API = {
    BASE_URL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
    REGISTER: '/users/',
    LOGIN:    '/token/pair',
    REFRESH:  '/token/refresh',
};

// ← TEMPORAIRE : affiche la config au démarrage
console.log('[LoveLine] API Config:', {
    BASE_URL: API.BASE_URL,
    REGISTER_URL: API.BASE_URL + API.REGISTER,
    LOGIN_URL:    API.BASE_URL + API.LOGIN,
    VITE_ENV:     import.meta.env.VITE_API_URL || 'NON DÉFINI ',
});
