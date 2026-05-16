// ecomerce-project/src/AuthPages/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from './config_api.js';

const AuthContext = createContext(null);

// ─── Helper robuste : lit la réponse sans jamais planter sur du HTML ─────────
async function parseResponse(response) {
    const text = await response.text();
    if (!text || text.trim() === '') return {};
    try {
        return JSON.parse(text);
    } catch {
        // Le serveur a renvoyé du HTML (page d'erreur Django, mauvaise URL, etc.)
        console.error('[LoveLine] Réponse non-JSON reçue du serveur :', text.slice(0, 200));
        throw new Error(
            response.ok
                ? 'Réponse inattendue du serveur. Contacte le support.'
                : `Erreur serveur (${response.status}). Vérifie l'URL de l'API et que le backend est démarré.`
        );
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('ll_access');
        const firstname = localStorage.getItem('user_firstname');
        if (token) return { firstname };
        return null;
    });
    const [token, setToken] = useState(localStorage.getItem('ll_access') || null);
    const [loading, setLoading] = useState(false);

    // ─── Refresh du token JWT toutes les 23h ────────────────────────────────
    const refreshToken = async () => {
        const refresh = localStorage.getItem('ll_refresh');
        if (!refresh) return;
        try {
            const res = await fetch(`${API.BASE_URL}${API.REFRESH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (!res.ok) { logout(); return; }
            const data = await parseResponse(res);
            if (data.access) {
                localStorage.setItem('ll_access', data.access);
                setToken(data.access);
            }
        } catch (e) {
            console.warn('[LoveLine] Refresh token échoué :', e.message);
        }
    };

    useEffect(() => {
        refreshToken();
        const interval = setInterval(refreshToken, 23 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // ─── INSCRIPTION ─────────────────────────────────────────────────────────
    const register = async (userData) => {
        const response = await fetch(`${API.BASE_URL}${API.REGISTER}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email:      userData.email,
                first_name: userData.firstName,
                last_name:  userData.lastName,
                password:   userData.password,
            }),
        });

        const data = await parseResponse(response); // ← ne plantera plus sur du HTML

        if (!response.ok) {
            // Django DRF renvoie les erreurs sous plusieurs formes possibles
            const msg =
                data.detail ||
                data.email?.[0] ||
                data.non_field_errors?.[0] ||
                data.password?.[0] ||
                JSON.stringify(data);
            throw new Error(msg || `Erreur ${response.status}`);
        }

        localStorage.setItem('user_firstname', userData.firstName);
        return data;
    };

    // ─── CONNEXION ───────────────────────────────────────────────────────────
    const login = async (email, password) => {
        const response = await fetch(`${API.BASE_URL}${API.LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await parseResponse(response);

        if (!response.ok) {
            const msg =
                data.detail ||
                data.non_field_errors?.[0] ||
                'Identifiants incorrects.';
            throw new Error(msg);
        }

        if (!data.access || !data.refresh) {
            throw new Error('Le serveur n\'a pas renvoyé de tokens JWT. Vérifie le endpoint LOGIN dans config_api.js');
        }

        localStorage.setItem('ll_access', data.access);
        localStorage.setItem('ll_refresh', data.refresh);
        setToken(data.access);

        // Récupération du profil pour vérifier s'il est complet
        let profileComplete = false;
        try {
            const profileRes = await fetch(`${API.BASE_URL}/profile/me`, {
                headers: { 'Authorization': `Bearer ${data.access}` },
            });
            if (profileRes.ok) {
                const profileData = await parseResponse(profileRes);
                profileComplete = profileData.is_complete ?? false;
            }
        } catch (e) {
            console.warn('[LoveLine] Impossible de charger le profil après connexion :', e.message);
        }

        setUser({ email, profileComplete });
        return data;
    };

    // ─── DÉCONNEXION ─────────────────────────────────────────────────────────
    const logout = () => {
        localStorage.removeItem('ll_access');
        localStorage.removeItem('ll_refresh');
        localStorage.removeItem('user_firstname');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
