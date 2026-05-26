import { apiFetch, apiFormData } from './api.helper';

export const profileService = {
    getMe: () => apiFetch('/api/profile/me'),
    update: (data) => apiFetch('/api/profile/me', { method: 'PATCH', body: JSON.stringify(data) }),
    
    uploadPhoto: (formData) => apiFormData('/api/profile/photos', formData, 'POST'),
    deletePhoto: (photoId) => apiFetch(`/api/profile/photos/${photoId}`, { method: 'DELETE' }),
    setMainPhoto: (photoId) => apiFetch(`/api/profile/photos/${photoId}/set-main`, { method: 'POST' }),
    
    updateInterests: (interests) => apiFetch('/api/profile/interests', { 
        method: 'PUT', 
        body: JSON.stringify({ interests }) 
    }),
    
    getVerificationStatus: () => apiFetch('/api/profile/verify/status'),
    updatePrivacy: (data) => apiFetch('/api/profile/privacy', { method: 'PATCH', body: JSON.stringify(data) }),
    updateNotifications: (data) => apiFetch('/api/profile/notifications', { method: 'PATCH', body: JSON.stringify(data) }),
    updateDiscoverySettings: (data) => apiFetch('/api/profile/discovery-settings', { method: 'PATCH', body: JSON.stringify(data) }),
    updateEmail: (data) => apiFetch('/api/profile/email', { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (data) => apiFetch('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    deleteAccount: () => apiFetch('/api/auth/delete-account', { method: 'DELETE' }),
};

export const discoverService = {
    getProfiles: (params) => apiFetch(`/api/discover${params ? '?' + params : ''}`),
    swipe: (userId, direction) => apiFetch('/api/discover/swipe', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, direction })
    }),
    rewind: () => apiFetch('/api/discover/rewind', { method: 'POST' }),
    activateBoost: () => apiFetch('/api/boost/activate', { method: 'POST' }),
    getBoostStatus: () => apiFetch('/api/boost/status'),
};

export const exploreService = {
    getCategories: () => apiFetch('/api/explore/categories'),
    getProfilesByCategory: (categoryId, page = 1) => apiFetch(`/api/explore/categories/${categoryId}/profiles?page=${page}`),
    search: (query) => apiFetch(`/api/explore/search?q=${encodeURIComponent(query)}`),
};

export const likesService = {
    getReceivedLikes: () => apiFetch('/api/likes/received'),
    getTopPicks: () => apiFetch('/api/likes/top-picks'),
    getSuperLikeStatus: () => apiFetch('/api/likes/superlike-status'),
};
