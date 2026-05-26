import { getBaseUrl } from '../core/utils/helpers';

const getToken = () => localStorage.getItem('ll_access');

export async function apiFetch(path, options = {}) {
    const base    = getBaseUrl();
    const token   = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    let res = await fetch(`${base}${path}`, { ...options, headers });

    if (res.status === 401) {
        const refresh = localStorage.getItem('ll_refresh');
        if (refresh) {
            const refreshRes = await fetch(`${base}/api/auth/token/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newAccess = data.access;
                localStorage.setItem('ll_access', newAccess);
                res = await fetch(`${base}${path}`, {
                    ...options,
                    headers: { ...headers, Authorization: `Bearer ${newAccess}` },
                });
            } else {
                localStorage.removeItem('ll_access');
                localStorage.removeItem('ll_refresh');
                window.location.href = '/auth';
                return null;
            }
        }
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Erreur réseau' }));
        throw new Error(err.detail || JSON.stringify(err));
    }
    if (res.status === 204) return null;
    return res.json();
}

export async function apiFormData(path, formData, method = 'PATCH') {
    const base  = getBaseUrl();
    const token = getToken();
    const res   = await fetch(`${base}${path}`, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
}
