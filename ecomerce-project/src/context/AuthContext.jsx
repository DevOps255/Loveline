// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect  } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('ll_access');
        const firstname = localStorage.getItem('user_firstname');
        if (token) return { firstname, email: localStorage.getItem('user_email') };
        return null;
    });
    const [token, setToken] = useState(localStorage.getItem('ll_access') || null);
    const [loading, setLoading] = useState(false);

    const refreshToken = async () => {
        const refresh = localStorage.getItem('ll_refresh');
        if (!refresh) return;
        try {
            const data = await authService.refreshToken(refresh);
            localStorage.setItem('ll_access', data.access);
            setToken(data.access);
        } catch {
            logout();
        }
    };

    useEffect(() => {
        const interval = setInterval(refreshToken, 23 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const register = async (userData) => {
        try {
            setLoading(true);
            const result = await authService.register(userData);
            localStorage.setItem('user_firstname', userData.firstName);
            localStorage.setItem('user_email', userData.email);
            return result;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            const data = await authService.login(email, password);
            localStorage.setItem('ll_access', data.access);
            localStorage.setItem('ll_refresh', data.refresh);
            localStorage.setItem('user_email', email);
            setToken(data.access);

            let profileComplete = false;
            try {
                const profileData = await authService.getMe(data.access);
                profileComplete = profileData.is_complete;
                if (profileData.first_name) {
                    localStorage.setItem('user_firstname', profileData.first_name);
                }
            } catch (e) {
                console.warn("Could not fetch profile details", e);
            }

            const firstname = localStorage.getItem('user_firstname');
            setUser({ email, firstname, profileComplete });
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        const refresh = localStorage.getItem('ll_refresh');
        if (refresh) {
            await authService.logout(refresh).catch(() => {});
        }
        localStorage.removeItem('ll_access');
        localStorage.removeItem('ll_refresh');
        localStorage.removeItem('user_firstname');
        localStorage.removeItem('user_email');
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