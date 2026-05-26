import { apiFetch } from './api.helper';

export const authService = {
    async login(email, password) {
        return apiFetch('/api/auth/token/pair', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async register(userData) {
        return apiFetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async logout(refreshToken) {
        if (!refreshToken) return;
        return apiFetch('/api/auth/token/blacklist', {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken }),
        }).catch(() => {});
    },

    async refreshToken(refresh) {
        return apiFetch('/api/auth/token/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh }),
        });
    },

    async getMe() {
        return apiFetch('/api/profile/me');
    }
};
